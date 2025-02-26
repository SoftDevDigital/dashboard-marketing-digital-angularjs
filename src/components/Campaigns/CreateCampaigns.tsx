"use client";

import { getHeadByAdvertiserID } from "@/app/api/head/route";
import apiClient from "@/libs/axiosConfig";
import React, { useState,useEffect  } from "react";


interface CreateCampaignsProps {
  selectedAdvertiser: number;
  advertisers: any[];
}


const CreateCampaigns: React.FC = (props) => {
  const [selectedAdvertiser, setSelectedAdvertiser] = useState<number>(0);
  const [advertisers, setAdvertisers] = useState<CreateCampaignsProps[]>(props.props);
  const [heads, setHeads] = useState<any[]>([]);
  const [selectedHead, setSelectedHead] = useState<number>(0);


  const handleChangeHeadsList = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setSelectedHead(selectedValue);
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold mb-4">Crear Campaña</h1>
      <p className="mb-4">
        Aquí puedes crear una nueva campaña. Completa los detalles a continuación.
      </p>
      <form>

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

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-white">
            Heads
          </label>
          <select
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
            value={selectedHead}
            onChange={(e) => handleChangeHeadsList(e.target.value)}
          >
           <option value="">Select...</option>
           {heads.map((head: any) => (
             <option key={head} value={head}>
               {head}
             </option>
           ))}
       </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Nombre de la Campaña:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Ejemplo: Campaña de Verano"
          />
        </div>
        {/* Agrega más campos de formulario aquí */}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="submit"
        >
          Crear Campaña
        </button>
      </form>
    </div>
  );
};

export default CreateCampaigns;