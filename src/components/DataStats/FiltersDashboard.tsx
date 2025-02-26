import { getDashboardData } from '@/app/api/dashboard/dashboard';
import { getAdvertisers, getSuppliers } from '@/app/api/filtersService/filtersService';
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import * as XLSX from 'xlsx';

const FiltersDashboard: React.FC = () => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [advertisers, setAdvertisers] = useState<any[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [selectedAdvertiser, setSelectedAdvertiser] = useState<any>(null);
  const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [showTable, setShowTable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);



  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const suppliersData = await getSuppliers();
        setSuppliers(suppliersData.result || []);

        const advertisersData = await getAdvertisers();
        setAdvertisers(advertisersData.result || []);
      } catch (error) {
        console.error('Error fetching filter data:', error);
      }
    };

    fetchFilters();
  }, []);

  const handleSupplierChange = (selectedOption: any) => {
    setSelectedSupplier(selectedOption);
  };

  const handleAdvertiserChange = (selectedOption: any) => {
    setSelectedAdvertiser(selectedOption);
  };

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFromDate(e.target.value);

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setToDate(e.target.value);

  const handleRefresh = async () => {
    try {
      if (!fromDate || !toDate) {
        console.error('Las fechas son requeridas.');
        return;
      }

      setIsLoading(true);
      const params = {
        datefrom: fromDate,
        dateto: toDate,
        AdvertiserID: selectedAdvertiser?.value || 0,
        SupplierID: selectedSupplier?.value || 0,
      };
  
      const response = await getDashboardData(params);
  
      if (response?.data) {
        const transformedData = response.data.result.map((item: any) => ({
          Advertiser: item.Advertiser || 'N/A',
          Campaign: item.Campaign || 'N/A',
          RateCampaign: item.RateCampaign || 'N/A',
          AMAdvertiser: item.AccountManagerAdv || 'N/A',
          Publisher: item.Supplier || 'N/A',
          Offer: item.OfferID || 'N/A',
          AMPublisher: item.AccountManagerPub || 'N/A',
          Clicks: item.ClickCount || 0,
          Installs: item.Install || 0,
          Events: item.TrackingEvents || 0,
          Revenue: item.Revenue || 0,
          Cost: item.Cost || 0,
          Profit: item.Profit || 0,
        }));
        setFilteredData(transformedData);
      }
    } catch (error) {
      console.error('Error al aplicar los filtros:', error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'FilteredData');
    XLSX.writeFile(workbook, 'FilteredData.xlsx');
  };

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: '#1f2937',
      borderColor: '#374151',
      height: '38px',
      color: '#ffffff',
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: '#1f2937',
      color: '#ffffff',
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#374151' : '#1f2937',
      color: '#ffffff',
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: '#ffffff',
    }),
    input: (provided: any) => ({
      ...provided,
      color: '#ffffff',
    }),
  };

  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex flex-col">
          <label htmlFor="supplierSelect" className="text-sm font-medium mb-1">Supplier</label>
          <Select
            id="supplierSelect"
            options={suppliers.map((supplier: any) => ({
              value: supplier.SupplierID,
              label: supplier.Supplier,
            }))}
            value={selectedSupplier}
            onChange={handleSupplierChange}
            isClearable
            placeholder="Select or search"
            styles={customStyles}
            className="w-full min-w-[150px] md:min-w-[200px]" 
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="advertiserSelect" className="text-sm font-medium mb-1">Advertiser</label>
          <Select
              id="advertiserSelect"
              options={advertisers.map((advertiser: any) => ({
                value: advertiser.AdvertiserID,
                label: advertiser.Advertiser,
              }))}
              value={selectedAdvertiser}
              onChange={handleAdvertiserChange}
              isClearable
              placeholder="Select or search"
              styles={customStyles}
              className="w-full min-w-[150px] md:min-w-[200px]" 
            />
        </div>

        <div className="flex flex-col">
          <label htmlFor="fromDate" className="text-sm font-medium mb-1">From</label>
          <input
            id="fromDate"
            type="date"
            className="border border-gray-600 rounded-md p-2 bg-gray-700 text-white h-10"
            value={fromDate}
            onChange={handleFromDateChange}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="toDate" className="text-sm font-medium mb-1">To</label>
          <input
            id="toDate"
            type="date"
            className="border border-gray-600 rounded-md p-2 bg-gray-700 text-white h-10"
            value={toDate}
            onChange={handleToDateChange}
          />
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={handleRefresh} 
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Refresh'}
        </button>
        {
          filteredData.length > 0 && (
            <button
              onClick={handleExportExcel}
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md"
            >
              Export Excel
            </button>
          )
        }
        {
          filteredData.length > 0 && (<button
            onClick={() => setShowTable(!showTable)}
            className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-md"
          >
            {showTable ? 'Hide List' : 'Show List'}
          </button>
          )
        }
      </div>
      {showTable && (
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-gray-700 text-white border border-gray-600 rounded-md">
        <thead>
  <tr>
    <th className="px-4 py-2 border-b border-gray-600">Advertiser</th>
    <th className="px-4 py-2 border-b border-gray-600">Campaign</th>
    <th className="px-4 py-2 border-b border-gray-600">Rate Campaign</th>
    <th className="px-4 py-2 border-b border-gray-600">AM Advertiser</th>
    <th className="px-4 py-2 border-b border-gray-600">Publisher</th>
    <th className="px-4 py-2 border-b border-gray-600">Offer</th>
    <th className="px-4 py-2 border-b border-gray-600">AM Publisher</th>
    <th className="px-4 py-2 border-b border-gray-600">Clicks</th>
    <th className="px-4 py-2 border-b border-gray-600">Installs</th>
    <th className="px-4 py-2 border-b border-gray-600">Events</th>
    <th className="px-4 py-2 border-b border-gray-600">Revenue</th>
    <th className="px-4 py-2 border-b border-gray-600">Cost</th>
    <th className="px-4 py-2 border-b border-gray-600">Profit</th>
  </tr>
</thead>
<tbody>
  {filteredData.length > 0 ? (
    filteredData.map((item, index) => (
      <tr key={index} className="hover:bg-gray-600">
        <td className="px-4 py-2 border-b border-gray-600">{item.Advertiser}</td>
        <td className="px-4 py-2 border-b border-gray-600">{item.Campaign}</td>
        <td className="px-4 py-2 border-b border-gray-600">{item.RateCampaign}</td>
        <td className="px-4 py-2 border-b border-gray-600">{item.AMAdvertiser}</td>
        <td className="px-4 py-2 border-b border-gray-600">{item.Publisher}</td>
        <td className="px-4 py-2 border-b border-gray-600">{item.Offer}</td>
        <td className="px-4 py-2 border-b border-gray-600">{item.AMPublisher}</td>
        <td className="px-4 py-2 border-b border-gray-600">{item.Clicks}</td>
        <td className="px-4 py-2 border-b border-gray-600">{item.Installs}</td>
        <td className="px-4 py-2 border-b border-gray-600">{item.Events}</td>
        <td className="px-4 py-2 border-b border-gray-600">{item.Revenue}</td>
        <td className="px-4 py-2 border-b border-gray-600">{item.Cost}</td>
        <td className="px-4 py-2 border-b border-gray-600">{item.Profit}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td className="px-4 py-2 text-center border-b border-gray-600" colSpan={13}>
      No data available for selected filters
      </td>
    </tr>
  )}
</tbody>
        </table>
      </div>
      )}
    </div>
  );
};

export default FiltersDashboard;








