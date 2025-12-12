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
        shopStatus[domain] = { isUninstalled: false, lastUninstallRow: null };
      }

      if (row.Event === 'Installed') {
        shopStatus[domain].isUninstalled = false;
      } else if (row.Event === 'Uninstalled') {
        shopStatus[domain].isUninstalled = true;
        shopStatus[domain].lastUninstallRow = row;
      }
    });

    const uninstalledShops = Object.values(shopStatus)
      .filter((status) => status.isUninstalled)
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
