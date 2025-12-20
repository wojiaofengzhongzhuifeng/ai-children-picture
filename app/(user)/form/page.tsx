import CreateNewBookForm from "@/app/(user)/form/ChildhoodAge";
import { FormCard, PageWrapper } from "./commonStyle";
import PictureStyle from "./PictureStyle";

export default function FormPage() {
  return (
    <>
      <PageWrapper>
        <FormCard>
          <CreateNewBookForm />
          <PictureStyle />
        </FormCard>
      </PageWrapper>
    </>
  );
}
