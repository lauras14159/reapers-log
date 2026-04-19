import { useState } from "react";
import { useAuthStore } from "../../components/hooks/useAuthStore";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
    const { signup, loading } = useAuthStore();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            await signup(name, email, password);
            navigate("/");
        } catch (err: any) {
            setError(err.response?.data?.message || "Signup failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] dark:bg-gray-800">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-md w-full max-w-md">

                <h1 className="text-2xl font-bold text-center mb-2">Create account 🏥</h1>
                <p className="text-center text-gray-500 mb-6 text-sm">Start managing your patients</p>

                {error && (
                    <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-medium mb-1 text-sm">Full Name</label>
                        <input
                            type="text"
                            required
                            className="border p-2 rounded w-full"
                            placeholder="Dr. John Doe"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1 text-sm">Email</label>
                        <input
                            type="email"
                            required
                            className="border p-2 rounded w-full"
                            placeholder="you@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1 text-sm">Password</label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            className="border p-2 rounded w-full"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded transition disabled:opacity-50"
                    >
                        {loading ? "Creating account..." : "Sign up"}
                    </button>
                </form>

                <p className="text-center text-sm mt-4 text-gray-500">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}