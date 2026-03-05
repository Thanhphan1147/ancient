## Docker Deployment
- Keep `Dockerfile` and `docker-compose.yml` in sync with any workspace changes
- Production builds via multi-stage Docker: shared → server → client → slim runtime
- Single container exposes port `2567` (Colyseus + static client)

## Development Environment
- Everything is done in a multipass VM. Do not make any changes to the host machine.
- Assume that there's a multipass VM pre-spawned. Find the name using `multipass list`. Interact with the VM using `multipass exec <VM_NAME> -- <command>`. If there's no VM, ask the project manager to spawn one.
- Redeploy after every change: `docker-compose up --build -d` inside the VM.
- Test the service using the Chrome MCP server. Fetch the multipass IP address using `multipass list` and open `http://<MULTIPASS_IP>:<PORT>` in the browser. Assume a Chrome browser instance is already running.
