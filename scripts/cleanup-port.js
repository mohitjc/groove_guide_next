#!/usr/bin/env node

const { execSync } = require('child_process');

const port = process.argv[2] || 3000;

console.log(`🔍 Checking for processes on port ${port}...`);

try {
  let command;
  
  if (process.platform === 'win32') {
    // Windows command
    command = `netstat -ano | findstr :${port}`;
    
    try {
      const output = execSync(command, { encoding: 'utf8' });
      const lines = output.trim().split('\n');
      
      const pids = new Set();
      lines.forEach(line => {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && !isNaN(pid)) {
          pids.add(pid);
        }
      });
      
      if (pids.size === 0) {
        console.log(`✅ Port ${port} is free`);
        process.exit(0);
      }
      
      console.log(`⚠️  Found ${pids.size} process(es) using port ${port}`);
      console.log(`🔪 Killing process(es)...`);
      
      pids.forEach(pid => {
        try {
          execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
        } catch (e) {
          // Process might already be dead
        }
      });
      
    } catch (error) {
      // No process found on port
      console.log(`✅ Port ${port} is free`);
      process.exit(0);
    }
    
  } else {
    // Unix-like systems (Linux, macOS)
    command = `lsof -ti:${port}`;
    
    try {
      const pid = execSync(command, { encoding: 'utf8' }).trim();
      
      if (!pid) {
        console.log(`✅ Port ${port} is free`);
        process.exit(0);
      }
      
      console.log(`⚠️  Found process ${pid} using port ${port}`);
      console.log(`🔪 Killing process...`);
      
      execSync(`kill -9 ${pid}`, { stdio: 'ignore' });
      
    } catch (error) {
      // No process found on port
      console.log(`✅ Port ${port} is free`);
      process.exit(0);
    }
  }
  
  // Wait a moment for the port to be released
  setTimeout(() => {
    console.log(`✅ Port ${port} is now free`);
    process.exit(0);
  }, 1000);
  
} catch (error) {
  console.error(`❌ Error: ${error.message}`);
  process.exit(1);
}