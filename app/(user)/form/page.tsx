import CreateNewBookForm from "@/app/(user)/form/ChildhoodAge";
import { FormCard, PageWrapper } from "./commonStyle";
import PictureStyle from "./PictureStyle";
import PictureBookTheme from "./PictureBookTheme";
import StoryOverview from "./StoryOverview";

export default function FormPage() {
  return (
    <>
      <PageWrapper>
        <FormCard>
          <CreateNewBookForm />
          <PictureStyle />
          <PictureBookTheme />
          <StoryOverview/>
        </FormCard>
      </PageWrapper>
    </>
  );
}
