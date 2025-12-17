import PageTitle from "./my/PageTitle";
import CoreFeatures from "./my/CoreFunction";
import UserFeedback from "./my/UserFeedback";
import { CreatePicture } from "./my/CreatePicture";
import ChoiceUs from "./my/ChoiceUs";

export default function HomePage() {
  return (
    <div>
      <PageTitle />
      <CoreFeatures />
      <CreatePicture/>
      <ChoiceUs/>
      <UserFeedback />
    </div>
  );
}
