"use client";

export default function MobileFallback() {
  return (
    <div className="w-full h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md space-y-6 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent">
          DYLAN
        </h1>
        <h2 className="text-xl text-gray-300">Web Developer</h2>

        <div className="space-y-4 pt-8">
          <div className="border border-neon-blue/30 rounded-lg p-6 hover:border-neon-blue/60 transition-colors">
            <h3 className="text-neon-blue font-semibold mb-2">Project 1</h3>
            <p className="text-gray-400 text-sm">3D Web Experience</p>
          </div>

          <div className="border border-neon-purple/30 rounded-lg p-6 hover:border-neon-purple/60 transition-colors">
            <h3 className="text-neon-purple font-semibold mb-2">Project 2</h3>
            <p className="text-gray-400 text-sm">Interactive Game</p>
          </div>

          <div className="border border-neon-pink/30 rounded-lg p-6 hover:border-neon-pink/60 transition-colors">
            <h3 className="text-neon-pink font-semibold mb-2">Project 3</h3>
            <p className="text-gray-400 text-sm">Modern Website</p>
          </div>
        </div>

        <p className="text-gray-500 text-sm pt-8">
          For the full 3D experience, please visit on desktop
        </p>
      </div>
    </div>
  );
}
