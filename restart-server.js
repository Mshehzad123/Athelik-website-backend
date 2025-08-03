import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function restartServer() {
  try {
    console.log("🔄 Restarting backend server...");
    
    // Kill existing Node.js processes (be careful!)
    console.log("🛑 Stopping existing Node.js processes...");
    try {
      await execAsync('taskkill /f /im node.exe');
      console.log("✅ Killed existing Node.js processes");
    } catch (error) {
      console.log("⚠️ Could not kill all Node.js processes:", error.message);
    }
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Start the server
    console.log("🚀 Starting backend server...");
    const { spawn } = await import('child_process');
    
    const server = spawn('npm', ['start'], {
      stdio: 'inherit',
      shell: true
    });
    
    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log("✅ Backend server restarted!");
    
  } catch (error) {
    console.error("❌ Error restarting server:", error);
  }
}

restartServer(); 