import sdl from '@kmamal/sdl';
import gpu from '@kmamal/gpu';

async function main() {
  const window = sdl.video.createWindow({
    title: 'Native Demo',
    width: 800,
    height: 600,
    accelerated: true,
    webgpu: true,
    vsync: true,
  });
  const instance = gpu.create([]);
  const adapter = await instance.requestAdapter();
  if (!adapter) {
    throw new Error('No compatible GPU adapter found');
  }

  const device = await adapter.requestDevice();
  if (!device) {
    throw new Error('Failed to create GPU device');
  }

  const renderer = gpu.renderGPUDeviceToWindow({ device, window });
  // Clear screen to red
  const commandEncoder = device.createCommandEncoder();
  const renderPass = commandEncoder.beginRenderPass({
    colorAttachments: [
      {
        view: renderer.getCurrentTextureView(),
        clearValue: { r: 1.0, g: 0.0, b: 0.0, a: 1.0 },
        loadOp: 'clear',
        storeOp: 'store',
      },
    ],
  });
  renderPass.end();
  device.queue.submit([commandEncoder.finish()]);

  // Render to window
  renderer.swap();
}

main();
