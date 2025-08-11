import { useEffect, useState } from "react";

function MikroTikData() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/mikrotik/active-users");
                const data = await response.json();

                if (response.ok) {
                    setUsers(data);
                } else {
                    setError(data.error || "Failed to fetch data");
                }
            } catch (err) {
                setError("Error fetching data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-bold mb-4">MikroTik Active Users</h2>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {users.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {users.map((user, index) => (
                        <div
                            key={index}
                            className="p-4 border rounded-lg shadow"
                        >
                            <h3 className="font-semibold">Name: {user.name}</h3>
                            <p>Service: {user.service}</p>
                            <p>Profile: {user.profile}</p>
                            <p>Address: {user.address}</p>
                            <p>Uptime: {user.uptime}</p>
                        </div>
                    ))}
                </div>
            ) : (
                !loading && <p>No active users found.</p>
            )}
        </div>
    );
}

export default MikroTikData;
