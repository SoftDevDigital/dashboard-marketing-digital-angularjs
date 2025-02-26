import { Metadata } from "next";
import ShowCampaignHead from "@/components/CampaignHeads/ShowCampaignHead";
import DefaultLayout from "@/components/Layouts/DefaultLaout";


const ShowCampaignHeadssPage = () => {
  return (
    <DefaultLayout>
      <ShowCampaignHead />
    </DefaultLayout>
  );
};

export default ShowCampaignHeadssPage;