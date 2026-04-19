import { useState } from "react";
import { useAuthStore } from "../../components/hooks/useAuthStore";
import { updateProfileApi } from "../../api/authApi";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const { user, setUser, logout } = useAuthStore();
    const navigate = useNavigate();

    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    // Get initials for avatar
    const initials = user?.name
        .split(" ")
        .map(n => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const updated = await updateProfileApi({
                name,
                email,
                ...(newPassword ? { password, newPassword } : {}),
            });
            setUser(updated);
            setSuccess("Profile updated successfully!");
            setPassword("");
            setNewPassword("");
        } catch (err: any) {
            setError(err.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <div className="max-w-lg mx-auto p-6">
            {/* Avatar */}
            <div className="flex flex-col items-center mb-8">
                <div className="w-24 h-24 rounded-full bg-blue-700 flex items-center justify-center text-white text-3xl font-bold">
                    {initials}
                </div>
                <p className="mt-3 text-lg font-semibold">{user?.name}</p>
                <p className="text-gray-500 text-sm">{user?.email}</p>
            </div>

            {error && (
                <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
                    {error}
                </div>
            )}
            {success && (
                <div className="bg-green-100 text-green-600 p-3 rounded mb-4 text-sm">
                    {success}
                </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                    <label className="block font-medium mb-1 text-sm">Full Name</label>
                    <input
                        type="text"
                        className="border p-2 rounded w-full"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1 text-sm">Email</label>
                    <input
                        type="email"
                        className="border p-2 rounded w-full"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>


                <p className="text-sm text-gray-500 pt-5">Leave blank to keep current password</p>

                <div>
                    <label className="block font-medium mb-1 text-sm">Current Password</label>
                    <input
                        type="password"
                        className="border p-2 rounded w-full"
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1 text-sm">New Password</label>
                    <input
                        type="password"
                        className="border p-2 rounded w-full"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded transition disabled:opacity-50"
                >
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </form>

            {/* Logout */}
            <button
                onClick={handleLogout}
                className="w-full mt-4 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white py-2 rounded transition"
            >
                Logout
            </button>
        </div>
    );
}