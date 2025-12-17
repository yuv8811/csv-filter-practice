import Papa from 'papaparse';
import Form from './components/form.jsx';
import './index.css';

function App() {
  const handleDataLoaded = (parsedData) => {
    const shopStatus = {};
    const sortedData = [...parsedData].sort((a, b) => {
      const dateA = a.Date || '';
      const dateB = b.Date || '';
      return dateA.localeCompare(dateB);
    });

    sortedData.forEach((row) => {
      const domain = row['Shop domain'];
      if (!domain) return;

      if (!shopStatus[domain]) {
        shopStatus[domain] = {
          isUninstalled: false,
          isClosed: false,
          lastUninstallRow: null
        };
      }

      const event = row.Event ? row.Event.trim() : '';

      if (event === 'Installed') {
        shopStatus[domain].isUninstalled = false;
      } else if (event === 'Uninstalled') {
        shopStatus[domain].isUninstalled = true;
        shopStatus[domain].lastUninstallRow = row;
      } else if (event === 'Store closed') {
        shopStatus[domain].isClosed = true;
      } else if (event === 'Store re-opened') {
        shopStatus[domain].isClosed = false;
      }
    });

    const uninstalledShops = Object.values(shopStatus)
      .filter((status) => status.isUninstalled && !status.isClosed)
      .map((status) => status.lastUninstallRow);

    if (uninstalledShops.length > 0) {
      const csv = Papa.unparse(uninstalledShops);
      const blob = new Blob([csv], { type: 'text/csv' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = 'uninstalled_shops.csv';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        URL.revokeObjectURL(url);
        link.remove();
      }, 100);
    } else {
      alert('No uninstalled shops found to download.');
    }
  };

  return (
    <div className="container">
      <Form onDataLoaded={handleDataLoaded} />
    </div>
  );
}

export default App;
