import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { TrendingUp, ArrowDownUp, Users, ShoppingBag, DollarSign, Package } from 'lucide-react';

/**
 * Sales Dashboard component rendering various sales analytics and graphs.
 * @example
 * // Usage in a React component
 * <SalesDashboard />
 * @returns {JSX.Element} A styled dashboard displaying sales data including total sales, invoices, top products, customers and sales trends.
 * @description
 *   - Utilizes React hooks (useState) for managing state related to time filtering.
 *   - Leverages context (`useAppContext`) to access global app data such as invoices, customers, and products.
 *   - Formats currency using `Intl.NumberFormat` for consistency according to 'en-GB' locale.
 *   - Provides an interactive time period selector to filter and display data for the last month, quarter, or year.
 */
const SalesModule: React.FC = () => {
  const { invoices, customers, products } = useAppContext();
  const [timeFilter, setTimeFilter] = useState('month'); // month, quarter, year

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Calculate total sales based on time filter
  /**
  * Calculate the total sum of paid invoices within a specified time period.
  * @example
  * calculateTotalPaidInvoices('month', invoices)
  * 1500
  * @param {string} timeFilter - The time period filter, can be 'month', 'quarter', or 'year'.
  * @param {Array} invoices - Array of invoice objects, each containing 'status', 'date', and 'total'.
  * @returns {number} Total sum of paid invoices within the specified time period.
  * @description
  *   - Filters invoices that are marked as 'paid'.
  *   - Calculates the total for invoices only if their date is newer than the threshold date.
  *   - The threshold date is determined based on the current date and the "timeFilter" specified.
  */
  const calculateTotalSales = () => {
    const now = new Date();
    let threshold = new Date();
    
    switch (timeFilter) {
      case 'month':
        threshold.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        threshold.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        threshold.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    const thresholdTime = threshold.getTime();
    
    return invoices
      .filter(invoice => invoice.status === 'paid' && new Date(invoice.date).getTime() >= thresholdTime)
      .reduce((sum, invoice) => sum + invoice.total, 0);
  };

  // Calculate total invoices count based on time filter
  /**
  * Filters and counts invoices based on specified time filter ('month', 'quarter', 'year').
  * @example
  * filterInvoicesByTime(invoices, 'month')
  * 5
  * @param {Array} invoices - List of invoices to be filtered.
  * @param {string} timeFilter - Time filter criterion ('month', 'quarter', 'year').
  * @returns {number} Number of invoices within the specified time period.
  * @description
  *   - Uses JavaScript's Date object to determine the threshold date.
  *   - Filters invoices by comparing their date against the calculated threshold time.
  *   - Supports basic time categories: month, quarter, and year.
  */
  const calculateInvoicesCount = () => {
    const now = new Date();
    let threshold = new Date();
    
    switch (timeFilter) {
      case 'month':
        threshold.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        threshold.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        threshold.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    const thresholdTime = threshold.getTime();
    
    return invoices
      .filter(invoice => new Date(invoice.date).getTime() >= thresholdTime)
      .length;
  };

  // Get top selling products
  /**
   * Processes invoices to compile and sort product sales data.
   * @example
   * aggregateProductSales(invoices)
   * [
   *   { productId: '123', name: 'Product A', quantity: 50, revenue: 500 },
   *   { productId: '456', name: 'Product B', quantity: 30, revenue: 300 },
   *   ...
   * ]
   * @param {Array<Object>} invoices - Array of invoice objects containing item details.
   * @returns {Array<Object>} Array of top 5 products sorted by quantity sold.
   * @description
   *   - Extracts product sales information from invoices and computes total quantities and revenue.
   *   - Constructs product sales data into an array and sorts it by highest quantity sold.
   *   - Limits the resulting array to the top 5 products based on quantity.
   */
  const getTopSellingProducts = () => {
    // Aggregate product quantities from invoices
    const productSales = {};
    
    invoices.forEach(invoice => {
      invoice.items.forEach(item => {
        if (productSales[item.productId]) {
          productSales[item.productId].quantity += item.quantity;
          productSales[item.productId].revenue += item.total;
        } else {
          productSales[item.productId] = {
            productId: item.productId,
            name: item.description,
            quantity: item.quantity,
            revenue: item.total
          };
        }
      });
    });
    
    // Convert to array and sort by quantity sold
    return Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  };

  // Get top customers
  /**
  * Aggregate customer purchases and return the top 5 customers by total spent
  * @example
  * aggregateAndRankCustomers(invoices)
  * [{"customerId": 1, "name": "John Doe", "total": 500, "count": 2}, ...]
  * @param {Array} invoices - An array of invoice objects each containing a customerId, customerName, and total.
  * @returns {Array} An array of aggregated customer sales data sorted by total spent.
  * @description
  *   - The function aggregates purchases per customer.
  *   - It sorts customers by the total amount spent in descending order.
  *   - The function only returns the top 5 customers based on their purchasing total.
  */
  const getTopCustomers = () => {
    // Aggregate customer purchases
    const customerSales = {};
    
    invoices.forEach(invoice => {
      if (customerSales[invoice.customerId]) {
        customerSales[invoice.customerId].total += invoice.total;
        customerSales[invoice.customerId].count += 1;
      } else {
        customerSales[invoice.customerId] = {
          customerId: invoice.customerId,
          name: invoice.customerName,
          total: invoice.total,
          count: 1
        };
      }
    });
    
    // Convert to array and sort by total spent
    return Object.values(customerSales)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  };

  // Calculate sales by month for current year
  /**
   * Calculates total sales for each month in the current year based on paid invoices.
   * @example
   * calculateMonthlySales(invoices)
   * [0, 2000, 1500, 0, 2200, 0, 0, 0, 0, 3000, 0, 0]
   * @param {Array} invoices - A list of invoice objects where each invoice contains a date, status, and total amount.
   * @returns {Array} An array of 12 numbers representing the total sales for each month in the current year.
   * @description
   *   - Processes only invoices marked as 'paid' within the current year.
   *   - Initializes an array of length 12 where each element corresponds to a month, starting from January.
   */
  const getSalesByMonth = () => {
    const currentYear = new Date().getFullYear();
    const salesByMonth = Array(12).fill(0);
    
    invoices
      .filter(invoice => invoice.status === 'paid' && new Date(invoice.date).getFullYear() === currentYear)
      .forEach(invoice => {
        const month = new Date(invoice.date).getMonth();
        salesByMonth[month] += invoice.total;
      });
    
    return salesByMonth;
  };

  // Generate monthly labels
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Total sales for the selected period
  const totalSales = calculateTotalSales();
  
  // Total invoices count for the selected period
  const invoicesCount = calculateInvoicesCount();
  
  // Average sale amount
  const averageSale = invoicesCount > 0 ? totalSales / invoicesCount : 0;

  // Top selling products
  const topProducts = getTopSellingProducts();
  
  // Top customers
  const topCustomers = getTopCustomers();
  
  // Sales by month
  const salesByMonth = getSalesByMonth();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Sales Dashboard</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Time Period:</span>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="border border-gray-300 rounded-md py-1 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-lg shadow-sm p-5 flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <DollarSign className="text-blue-600" size={24} />
          </div>
          <div>
            <h3 className="text-gray-500 text-sm font-medium">Total Sales</h3>
            <p className="text-2xl font-bold">{formatCurrency(totalSales)}</p>
            <p className="text-sm text-gray-500">
              {timeFilter === 'month' ? 'Last 30 days' : timeFilter === 'quarter' ? 'Last 90 days' : 'Last 12 months'}
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-5 flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <ShoppingBag className="text-green-600" size={24} />
          </div>
          <div>
            <h3 className="text-gray-500 text-sm font-medium">Invoices Created</h3>
            <p className="text-2xl font-bold">{invoicesCount}</p>
            <p className="text-sm text-gray-500">
              {timeFilter === 'month' ? 'Last 30 days' : timeFilter === 'quarter' ? 'Last 90 days' : 'Last 12 months'}
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-5 flex items-center">
          <div className="rounded-full bg-purple-100 p-3 mr-4">
            <ArrowDownUp className="text-purple-600" size={24} />
          </div>
          <div>
            <h3 className="text-gray-500 text-sm font-medium">Average Sale</h3>
            <p className="text-2xl font-bold">{formatCurrency(averageSale)}</p>
            <p className="text-sm text-gray-500">
              {timeFilter === 'month' ? 'Last 30 days' : timeFilter === 'quarter' ? 'Last 90 days' : 'Last 12 months'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Package size={18} className="text-blue-600 mr-2" />
            Top Selling Products
          </h2>
          
          <div className="space-y-4">
            {topProducts.length > 0 ? (
              topProducts.map((product, index) => (
                <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-500">Sold: {product.quantity} units</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-green-600">{formatCurrency(product.revenue)}</div>
                    </div>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full" 
                      style={{ width: `${(product.quantity / topProducts[0].quantity) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">No product sales data available</div>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Users size={18} className="text-purple-600 mr-2" />
            Top Customers
          </h2>
          
          <div className="space-y-4">
            {topCustomers.length > 0 ? (
              topCustomers.map((customer, index) => (
                <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-gray-500">Purchases: {customer.count} orders</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-green-600">{formatCurrency(customer.total)}</div>
                    </div>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-purple-600 h-1.5 rounded-full" 
                      style={{ width: `${(customer.total / topCustomers[0].total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">No customer sales data available</div>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-5">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <TrendingUp size={18} className="text-blue-600 mr-2" />
          Sales Trend (This Year)
        </h2>
        
        <div className="h-60">
          <div className="flex h-full items-end space-x-2">
            {salesByMonth.map((value, index) => {
              const maxValue = Math.max(...salesByMonth, 1); // Avoid division by zero
              const percentage = (value / maxValue) * 100;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="relative w-full flex justify-center group">
                    <div 
                      className="bg-blue-500 hover:bg-blue-600 w-full max-w-[30px] rounded-t-sm transition-all"
                      style={{ height: `${Math.max(percentage, 2)}%` }}
                    ></div>
                    <div className="absolute -top-9 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {formatCurrency(value)}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{monthLabels[index]}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesModule;