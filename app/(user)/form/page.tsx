import CreateNewBookForm from "@/app/(user)/form/ChildhoodAge";
import { FormCard, PageWrapper } from "./commonStyle";
import PictureStyle from "./PictureStyle";
import PictureBookTheme from "./PictureBookTheme";

export default function FormPage() {
  return (
    <>
      <PageWrapper>
        <FormCard>
          <CreateNewBookForm />
          <PictureStyle />
          <PictureBookTheme />
        </FormCard>
      </PageWrapper>
    </>
  );
}
