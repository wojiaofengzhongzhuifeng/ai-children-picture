import PageTitle from "./my/PageTitle";
import CoreFeatures from "./my/CoreFunction";
import UserFeedback from "./my/UserFeedback";
import CreatePicture from "./my/CreatePicture";
import ChoiceUs from "./my/ChoiceUs";
import StartCreate from "./my/StartCreact";
import PageFooter from "./my/PageFooter";

export default function HomePage() {
  return (
    <div>
      <PageTitle />
      <CoreFeatures />
      <CreatePicture />
      <ChoiceUs />
      <UserFeedback />
      <StartCreate />
      <PageFooter />
    </div>
  );
}
