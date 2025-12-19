import StatCard from '../components/StatCard';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function Dashboard() {
  const stats = [
    { 
      title: "Pesanan Aktif", 
      value: "12", 
      change: "+2", 
      icon: "📦", 
      color: "blue",
      link: "/orders"
    },
    { 
      title: "Revenue Bulan Ini", 
      value: "Rp 48.5jt", 
      change: "+12.5%", 
      icon: "💰", 
      color: "green",
      link: "/finance"
    },
    { 
      title: "Profit Margin", 
      value: "33.2%", 
      change: "+2.1%", 
      icon: "📊", 
      color: "purple",
      link: "/finance"
    },
    { 
      title: "Avg Order Value", 
      value: "Rp 1.25jt", 
      change: "+5.3%", 
      icon: "📈", 
      color: "yellow",
      link: "/finance"
    },
  ];

  const recentOrders = [
    { id: 'ORD-00124', customer: 'Toko Maju Jaya', items: 3, status: 'production', deadline: '2 hari' },
    { id: 'ORD-00123', customer: 'Butik Modern', items: 1, status: 'cutting', deadline: '1 hari' },
    { id: 'ORD-00122', customer: 'Konveksi Sejahtera', items: 5, status: 'sewing', deadline: '3 hari' },
  ];

  // Helper untuk color classes
  const getColorClass = (color) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      purple: 'bg-purple-100 text-purple-600',
      green: 'bg-green-100 text-green-600',
    };
    return colorMap[color] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="space-y-4 md:space-y-6 mt-2">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-gray-800">Dashboard Produksi</h2>
          <p className="text-xs md:text-sm text-gray-600 mt-0.5">Ringkasan aktivitas produksi terkini</p>
        </div>
        <Button variant="primary" size="sm" className="mt-2 md:mt-0">
          + Buat Pesanan Baru
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, index) => (
          <a 
            key={index} 
            href={stat.link}
            className="block bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">{stat.title}</p>
                <div className="flex items-end mt-1">
                  <p className="text-lg font-bold text-gray-800">{stat.value}</p>
                  <span className={`ml-1 text-xs font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`text-xl p-2 rounded-lg ${getColorClass(stat.color)}`}>
                {stat.icon}
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Orders */}
        <Card className="p-3">
          <CardHeader className="pb-2">
            <h3 className="font-semibold text-gray-800">Pesanan Terbaru</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm text-gray-800">{order.id}</p>
                    <p className="text-xs text-gray-600">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {order.items} item
                    </span>
                    <p className="text-xs text-gray-600 mt-1">Deadline: {order.deadline}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Production Status */}
        <Card className="p-3">
          <CardHeader className="pb-2">
            <h3 className="font-semibold text-gray-800">Status Produksi</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {['Cutting', 'Sewing', 'Finishing', 'Packing'].map((stage) => (
                <div key={stage} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                      <span className="text-base">
                        {stage === 'Cutting' ? '✂️' : 
                         stage === 'Sewing' ? '🧵' : 
                         stage === 'Finishing' ? '✨' : '📦'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-800">{stage}</p>
                      <p className="text-xs text-gray-600">Departemen</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">{Math.floor(Math.random() * 50) + 10}</p>
                    <p className="text-xs text-gray-600">item</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}