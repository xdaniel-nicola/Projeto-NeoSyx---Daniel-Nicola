"use client";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const Page = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, error } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-400 to-gray-800 w-full">
      <div className="flex flex-col max-w-md w-full h-full p-8 mx-auto text-center text-white bg-white bg-opacity-10 backdrop-blur-lg rounded-lg shadow-lg">
        <h1 className="mb-4 text-2xl font-bold text-white">Login</h1>
        <form className="flex flex-col items-center gap-4" onSubmit={handleLogin}>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 text-black bg-white border border-gray-300 rounded-lg outline-none"
            type="text"
            placeholder="Digite seu email"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 text-black bg-white border border-gray-300 rounded-lg outline-none"
            type="password"
            placeholder="Digite sua senha"
          />
          <button
            className="w-full px-4 py-2 font-bold text-white bg-gray-800 rounded-lg hover:bg-gray-600 transition duration-200"
            type="submit"
          >
            Entrar
          </button>
          <p className="text-white ">Não tem uma conta?</p>
          <a className="text-white p-2 bg-gray-600 hover:bg-gray-400 rounded-lg transition duration-200" href="/register">
            Clique aqui
          </a>

          {error && <p className="mt-2 text-red-400">{error?.message}</p>}
        </form>
      </div>
    </main>
  );
};

export default Page;
