"use client";
import { getAdvertisers } from "@/app/api/filtersService/filtersService";
import apiClient from "@/libs/axiosConfig";
import React, { useState,useEffect  } from "react";
import { FaTrash, FaPlus, FaSync } from "react-icons/fa";

import CreateCampaigns from "./CreateCampaigns";
interface Campaign {
  CampaignID: number;
  Campaign: string;
  CampaignType?: string;
  Advertiser?: string;
  CampaignHead?: string;
  Cost?: number;
  PayOut?: number;
  Discount?: number;
  CampaignCategory?: string;
  Device?: string;
  DailyAmount?: number;
  DailyQuantityClick?: number;
  Countrys?: string;
  Comments?: string;
  Geo?: {
    Icon72?: string;
  };
}


const ShowCampaigns: React.FC = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [advertisers, setAdvertisers] = useState([]);
  const [selectedAdvertiser, setSelectedAdvertiser] = useState(""); 
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false); 

  useEffect(() => {
    const fetchAdvertisers = async () => {
      try {
        const data = await getAdvertisers();
        setAdvertisers(data.result); 
      } catch (error) {
        console.error("Error fetching advertisers:", error);
      }
    };

    fetchAdvertisers();
  }, []);

  const handleRefresh = async () => {
    if (!selectedAdvertiser) {
      console.error("No advertiser selected");
      return;
    }
  
    try {
      const response = await apiClient.get(`/campaigns`, {
        params: {
          AdvertiserID: selectedAdvertiser,
          StartDate: fromDate,
          EndDate: toDate,
          StatusID: "A",
          Platform: 0,
        },
        headers: {
          'Access-Token': localStorage.getItem('accessToken'),
        },
      });
    
      if (response.data && Array.isArray(response.data.result)) {
        setCampaigns(response.data.result as Campaign[]);
      } else {
        console.warn("No campaigns found");
        setCampaigns([]);
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  const fetchCampaignsByName = async () => {
    if (!selectedCampaign) {
      console.error("No campaign selected");
      return;
    }
  
    try {
      const response = await apiClient.get(`/campaigns`, {
        params: {
          CampaignName: selectedCampaign,
          AdvertiserID: selectedAdvertiser || undefined,
          StartDate: fromDate,
          EndDate: toDate,
          StatusID: "A",
          Platform: 0,
        },
        headers: {
          'Access-Token': localStorage.getItem('accessToken'),
        },
      });
    
      if (response.data && response.data.result) {
        setCampaigns(response.data.result);
      } else {
        console.warn("No campaigns found");
        setCampaigns([]);
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  const handleCampaignChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedCampaign(value);
  
    if (value.length > 0) {
      const filtered = campaigns.filter((campaign: Campaign) =>
        campaign.Campaign.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCampaigns(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  
  const selectCampaign = (campaignName: string) => {
    setSelectedCampaign(campaignName);
    setShowSuggestions(false);
  };



  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (




    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      
      
    <div>
      <h1>Mis Campañas</h1>
      <button
        onClick={handleOpenModal}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Añadir
      </button>

      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "5px",
              width: "80%", // Ajusta el ancho según tus necesidades
              maxWidth: "600px", // Ancho máximo para pantallas grandes
              zIndex: 9999, // Esto asegura que el modal esté por encima de todo lo demás
            }}
          >
            <CreateCampaigns props={advertisers} />
            <button
              onClick={handleCloseModal}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
      
      
      {/* Filtros */}
   
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-white">
            Advertisers
          </label>
          <select
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
            value={selectedAdvertiser}
            onChange={(e) => setSelectedAdvertiser(e.target.value)}
          >
           <option value="">Select...</option>
           {advertisers.map((advertiser: any) => (
             <option key={advertiser.AdvertiserID} value={advertiser.AdvertiserID}>
               {advertiser.Advertiser}
             </option>
           ))}
       </select>
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-white">
            Campaign
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
            value={selectedCampaign}
            onChange={handleCampaignChange}
            placeholder="Type campaign name..."
          />
          {showSuggestions && filteredCampaigns.length > 0 && (
            <ul className="absolute w-full bg-white dark:bg-gray-700 border rounded-md mt-1 z-10">
              {filteredCampaigns.map((campaign: any) => (
                <li
                  key={campaign.CampaignID}
                  onClick={() => selectCampaign(campaign.Campaign)}
                  className="p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  {campaign.Campaign}
                </li>
              ))}
            </ul>
          )}
          {selectedCampaign && (
            <button 
              onClick={fetchCampaignsByName}
              className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded-md flex items-center mt-2"
            >
              🔍
            </button>
          )}
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-white">
            Status
          </label>
          <select className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white">
            <option>Active</option>
            <option>Paused</option>
            <option>Inactive</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-white">
            Platform
          </label>
          <select className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white">
            <option>All</option>
            <option>Mobile</option>
            <option>Desktop</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-white">
            From
          </label>
          <input
            type="date"
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-white">
            To
          </label>
          <input
            type="date"
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

       
        <div className="flex items-end space-x-2">
          <button onClick={CreateCampaigns}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center">
            <FaPlus className="mr-2" />
            Add
          </button>
          <button 
  onClick={handleRefresh} 
  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center"
>
  <FaSync className="mr-2" />
  Refresh
</button>
        </div>
      </div>

     
      <div className="overflow-x-auto mt-6">
        <table className="w-full border-collapse bg-white dark:bg-gray-800">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white">
              <th className="p-2">Date</th>
              <th className="p-2">Type</th>
              <th className="p-2">Advertiser</th>
              <th className="p-2">Head Campaigns</th>
              <th className="p-2">Cost</th>
              <th className="p-2">PayOut</th>
              <th className="p-2">Discount</th>
              <th className="p-2">Category</th>
              <th className="p-2">Device</th>
              <th className="p-2">Daily Budget</th>
              <th className="p-2">Daily Installs</th>
              <th className="p-2">Countries</th>
              <th className="p-2">Preview Link</th>
              <th className="p-2">Comments</th>
              <th className="p-2">URL</th>
            </tr>
          </thead>
          <tbody>
  {campaigns.length > 0 ? (
    campaigns.map((campaign: Campaign, index) => (
      <tr key={index} className="border-b">
        <td className="p-2">N/A</td>
        <td className="p-2">{campaign.CampaignType || "N/A"}</td>
        <td className="p-2">{campaign.Advertiser || "N/A"}</td>
        <td className="p-2">{campaign.CampaignHead || "N/A"}</td>
        <td className="p-2">${campaign.Cost || "0"}</td>
        <td className="p-2">${campaign.PayOut || "0"}</td>
        <td className="p-2">${campaign.Discount || "0"}</td>
        <td className="p-2">{campaign.CampaignCategory || "N/A"}</td>
        <td className="p-2">{campaign.Device || "N/A"}</td>
        <td className="p-2">${campaign.DailyAmount || "0"}</td>
        <td className="p-2">{campaign.DailyQuantityClick || "0"}</td>
        <td className="p-2">{campaign.Countrys || "N/A"}</td>
        <td className="p-2">
          <a href={campaign.Geo?.Icon72} target="_blank" className="text-blue-500">
            Link
          </a>
        </td>
        <td className="p-2">{campaign.Comments || "N/A"}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={14} className="p-4 text-center">
        No campaigns found
      </td>
    </tr>
  )}
</tbody>
        </table>
      </div>
    </div>
  );
};

export default ShowCampaigns;
