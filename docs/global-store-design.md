# 儿童绘本生成器 - 全局状态管理设计文档

## 一、核心数据结构设计

```typescript
// 单个场景的完整数据
interface SceneData {
  id: string; // 唯一标识符（用于追踪和排序）
  index: number; // 场景序号（0-7），保证顺序
  text: string; // 故事文字
  img_text_prompt: string; // 图片生成提示词
  imageUrl: string | null; // 生成的图片URL
  imageStatus: 'pending' | 'loading' | 'success' | 'error'; // 图片状态
  error?: string; // 错误信息
}

// 全局 Store 结构
interface StoryStore {
  // 用户选择的表单数据
  formData: {
    child_age: string;
    illustration_style: string;
    themes: string[];
    story_overview: string;
    central_idea: string;
  };

  // AI 生成的场景数据
  scenes: SceneData[];

  // 全局状态
  status:
    | 'idle'
    | 'generating_prompts'
    | 'generating_images'
    | 'completed'
    | 'error';

  // 元数据
  metadata: {
    sceneCount: number;
    completedImages: number;
    generationTime: number;
  } | null;
}
```

## 二、解决图片乱序问题（关键）

### 问题原因

并发请求图片时，响应顺序不确定。例如：场景3的图片可能比场景1先返回。

### 解决方案：使用 `index` 字段绑定，而非依赖返回顺序

```typescript
// ❌ 错误做法：按返回顺序追加
const handleImageComplete = (imageUrl: string) => {
  setScenes((prev) => [...prev, { imageUrl }]); // 会乱序！
};

// ✅ 正确做法：按 index 更新指定位置
const handleImageComplete = (index: number, imageUrl: string) => {
  setScenes((prev) =>
    prev.map((scene) =>
      scene.index === index
        ? { ...scene, imageUrl, imageStatus: 'success' }
        : scene
    )
  );
};
```

### 请求时绑定 index

```typescript
// 并发生成图片，但每个请求携带自己的 index
scenes.forEach((scene, index) => {
  generateImage(scene.img_text_prompt)
    .then((url) =>
      updateScene(index, { imageUrl: url, imageStatus: 'success' })
    )
    .catch((err) =>
      updateScene(index, { imageStatus: 'error', error: err.message })
    );
});
```

## 三、数据加载策略分析

### 方案 A：一次性全部返回（推荐用于提示词）

```
用户提交 → 等待 → 一次性获得8个场景的提示词 → 存入Store
```

**优点**：

- 数据完整性高，不会有中间状态
- 实现简单，容易管理

**缺点**：

- 用户等待时间长（约 10-15 秒）

**适用于**：`/api/create-prompt` 返回的故事场景数据

---

### 方案 B：逐个返回并更新（推荐用于图片）

```
获得提示词后 → 并发请求8张图片 → 每张图片返回后立即更新UI
```

**优点**：

- 用户体验好，能看到进度
- 不会因为某一张失败而阻塞其他

**缺点**：

- 需要处理并发和状态同步

**适用于**：`/api/generate-ai-children-picture` 图片生成

## 四、推荐的数据流程

```
┌─────────────────────────────────────────────────────────────────┐
│                         用户提交表单                              │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 1: 调用 /api/create-prompt                                 │
│  - status: 'generating_prompts'                                 │
│  - 一次性返回 8 个场景的 text + img_text_prompt                    │
│  - 初始化 scenes 数组，所有图片状态为 'pending'                     │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 2: 并发调用 /api/generate-ai-children-picture (8次)        │
│  - status: 'generating_images'                                   │
│  - 每个请求开始时：scenes[index].imageStatus = 'loading'          │
│  - 每个请求完成时：scenes[index].imageUrl = url, status='success' │
│  - 请求失败时：scenes[index].imageStatus = 'error'               │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 3: 全部完成                                                │
│  - status: 'completed'                                           │
│  - 可以展示完整绘本                                               │
└─────────────────────────────────────────────────────────────────┘
```

## 五、并发控制建议

### 问题

同时发起 8 个图片请求可能触发 API 限流（429）

### 解决方案：限制并发数

```typescript
// 使用 p-limit 或手写并发控制
import pLimit from 'p-limit';

const limit = pLimit(3); // 最多同时 3 个请求

const generateAllImages = async (scenes: SceneData[]) => {
  await Promise.all(
    scenes.map((scene, index) =>
      limit(() => generateImageForScene(index, scene.img_text_prompt))
    )
  );
};
```

### 手写并发控制（不依赖外部库）

```typescript
async function generateImagesWithConcurrencyLimit(
  scenes: SceneData[],
  maxConcurrent: number = 3
) {
  const queue = [...scenes];
  const results: Promise<void>[] = [];

  const worker = async () => {
    while (queue.length > 0) {
      const scene = queue.shift();
      if (!scene) break;

      try {
        updateScene(scene.index, { imageStatus: 'loading' });
        const imageUrl = await generateImage(scene.img_text_prompt);
        updateScene(scene.index, { imageUrl, imageStatus: 'success' });
      } catch (error) {
        updateScene(scene.index, {
          imageStatus: 'error',
          error: error instanceof Error ? error.message : '生成失败',
        });
      }
    }
  };

  // 启动 maxConcurrent 个 worker
  for (let i = 0; i < maxConcurrent; i++) {
    results.push(worker());
  }

  await Promise.all(results);
}
```

## 六、Store 实现示例（Zustand）

```typescript
import { create } from 'zustand';

// 类型定义
interface SceneData {
  id: string;
  index: number;
  text: string;
  img_text_prompt: string;
  imageUrl: string | null;
  imageStatus: 'pending' | 'loading' | 'success' | 'error';
  error?: string;
}

interface FormData {
  child_age: string;
  illustration_style: string;
  themes: string[];
  story_overview: string;
  central_idea: string;
}

interface StoryStore {
  // 状态
  formData: FormData | null;
  scenes: SceneData[];
  status:
    | 'idle'
    | 'generating_prompts'
    | 'generating_images'
    | 'completed'
    | 'error';
  globalError: string | null;

  // 操作 - 表单数据
  setFormData: (formData: FormData) => void;

  // 操作 - 场景数据
  initScenes: (
    scenes: Array<{ text: string; img_text_prompt: string }>
  ) => void;
  updateScene: (index: number, updates: Partial<SceneData>) => void;

  // 操作 - 状态管理
  setStatus: (status: StoryStore['status']) => void;
  setError: (error: string | null) => void;

  // 操作 - 重置
  reset: () => void;

  // 计算属性
  getCompletedCount: () => number;
  getProgress: () => number;
}

export const useStoryStore = create<StoryStore>((set, get) => ({
  // 初始状态
  formData: null,
  scenes: [],
  status: 'idle',
  globalError: null,

  // 设置表单数据
  setFormData: (formData) => set({ formData }),

  // 初始化场景（从 create-prompt API 返回后调用）
  initScenes: (rawScenes) =>
    set({
      scenes: rawScenes.map((scene, index) => ({
        id: `scene-${index}-${Date.now()}`,
        index,
        text: scene.text,
        img_text_prompt: scene.img_text_prompt,
        imageUrl: null,
        imageStatus: 'pending' as const,
      })),
    }),

  // 更新单个场景（图片生成完成后调用）
  updateScene: (index, updates) =>
    set((state) => ({
      scenes: state.scenes.map((scene) =>
        scene.index === index ? { ...scene, ...updates } : scene
      ),
    })),

  // 设置全局状态
  setStatus: (status) => set({ status }),
  setError: (globalError) => set({ globalError, status: 'error' }),

  // 重置所有状态
  reset: () =>
    set({
      formData: null,
      scenes: [],
      status: 'idle',
      globalError: null,
    }),

  // 获取已完成的图片数量
  getCompletedCount: () => {
    return get().scenes.filter((s) => s.imageStatus === 'success').length;
  },

  // 获取进度百分比
  getProgress: () => {
    const scenes = get().scenes;
    if (scenes.length === 0) return 0;
    const completed = scenes.filter((s) => s.imageStatus === 'success').length;
    return Math.round((completed / scenes.length) * 100);
  },
}));
```

## 七、使用示例

### 1. 提交表单并生成提示词

```typescript
const handleSubmit = async (formData: FormData) => {
  const { setFormData, initScenes, setStatus, setError } =
    useStoryStore.getState();

  try {
    // 保存表单数据
    setFormData(formData);
    setStatus('generating_prompts');

    // 调用 API 生成提示词
    const response = await fetch('/api/create-prompt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || '生成失败');
    }

    // 初始化场景数据
    initScenes(data.scenes);

    // 开始生成图片
    await generateAllImages();
  } catch (error) {
    setError(error instanceof Error ? error.message : '未知错误');
  }
};
```

### 2. 并发生成图片

```typescript
const generateAllImages = async () => {
  const { scenes, updateScene, setStatus } = useStoryStore.getState();

  setStatus('generating_images');

  // 并发控制：最多同时 3 个请求
  const maxConcurrent = 3;
  const queue = [...scenes];

  const worker = async () => {
    while (queue.length > 0) {
      const scene = queue.shift();
      if (!scene) break;

      try {
        updateScene(scene.index, { imageStatus: 'loading' });

        const response = await fetch('/api/generate-ai-children-picture', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: scene.img_text_prompt }),
        });

        const data = await response.json();

        if (data.success) {
          updateScene(scene.index, {
            imageUrl: data.imageUrl,
            imageStatus: 'success',
          });
        } else {
          throw new Error(data.error);
        }
      } catch (error) {
        updateScene(scene.index, {
          imageStatus: 'error',
          error: error instanceof Error ? error.message : '生成失败',
        });
      }
    }
  };

  // 启动 worker
  await Promise.all(Array.from({ length: maxConcurrent }, () => worker()));

  setStatus('completed');
};
```

### 3. 在组件中使用

```tsx
function StoryViewer() {
  const { scenes, status, getProgress } = useStoryStore();

  if (status === 'generating_prompts') {
    return <div>正在生成故事...</div>;
  }

  if (status === 'generating_images') {
    return (
      <div>
        <div>正在生成图片... {getProgress()}%</div>
        <div className="grid grid-cols-4 gap-4">
          {scenes.map((scene) => (
            <SceneCard key={scene.id} scene={scene} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {scenes.map((scene) => (
        <SceneCard key={scene.id} scene={scene} />
      ))}
    </div>
  );
}

function SceneCard({ scene }: { scene: SceneData }) {
  return (
    <div className="border rounded-lg p-4">
      <div className="text-sm mb-2">{scene.text}</div>

      {scene.imageStatus === 'pending' && (
        <div className="bg-gray-100 h-40 flex items-center justify-center">
          等待生成
        </div>
      )}

      {scene.imageStatus === 'loading' && (
        <div className="bg-gray-100 h-40 flex items-center justify-center">
          <Spinner /> 生成中...
        </div>
      )}

      {scene.imageStatus === 'success' && scene.imageUrl && (
        <img
          src={scene.imageUrl}
          alt={scene.text}
          className="h-40 object-cover"
        />
      )}

      {scene.imageStatus === 'error' && (
        <div className="bg-red-100 h-40 flex items-center justify-center text-red-600">
          生成失败
          <button onClick={() => retryScene(scene.index)}>重试</button>
        </div>
      )}
    </div>
  );
}
```

## 八、关键注意事项清单

| 问题               | 解决方案                                           |
| ------------------ | -------------------------------------------------- |
| 图片返回乱序       | 使用 `index` 字段定位更新，不依赖返回顺序          |
| 提示词与图片不匹配 | 场景初始化时就绑定 `id` 和 `index`，全程不变       |
| API 限流           | 控制并发数（建议 2-3 个）                          |
| 部分图片失败       | 每个场景独立状态，支持单独重试                     |
| 用户刷新丢失数据   | 可选：使用 `zustand/persist` 持久化到 localStorage |
| 长时间等待无反馈   | 显示每个场景的独立加载状态和整体进度               |
| 组件卸载后状态更新 | 使用 Zustand 的 store 是独立于组件的，无需担心     |

## 九、可选优化

### 1. 数据持久化

```typescript
import { persist } from 'zustand/middleware';

export const useStoryStore = create(
  persist<StoryStore>(
    (set, get) => ({
      // ... store 定义
    }),
    {
      name: 'story-storage',
      partialize: (state) => ({
        formData: state.formData,
        scenes: state.scenes,
        status: state.status,
      }),
    }
  )
);
```

### 2. 单个场景重试

```typescript
const retryScene = async (index: number) => {
  const { scenes, updateScene } = useStoryStore.getState();
  const scene = scenes.find((s) => s.index === index);

  if (!scene) return;

  try {
    updateScene(index, { imageStatus: 'loading', error: undefined });

    const response = await fetch('/api/generate-ai-children-picture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: scene.img_text_prompt }),
    });

    const data = await response.json();

    if (data.success) {
      updateScene(index, { imageUrl: data.imageUrl, imageStatus: 'success' });
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    updateScene(index, {
      imageStatus: 'error',
      error: error instanceof Error ? error.message : '重试失败',
    });
  }
};
```

---

## 总结

1. **提示词数据**：一次性获取并初始化完整的 `scenes` 数组
2. **图片生成**：并发执行，每张图片独立更新对应 `index` 的位置
3. **防止乱序**：通过 `index` 字段严格绑定，确保数据一致性
4. **并发控制**：限制同时进行的请求数（建议 2-3 个）
5. **错误处理**：支持单个场景独立重试，不影响其他场景
