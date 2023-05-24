import {
  Document,
  NodeIO,
  Accessor,
} from "@gltf-transform/core"

async function createAnimatedTetra() {
  const doc = new Document();
  const buffer = doc.createBuffer("dataBuffer")
  const positions = doc.createAccessor("positions")
    .setArray(new Float32Array([
      -1.0, -1.0, 0,
      1.0, -1.0, 0,
      0.5, 0.5, 0,

      -1.0, -1.0, 0,
      0, 0, 1.0,
      0.5, 0.5, 0,

      -1.0, -1.0, 0,
      1.0, -1.0, 0,
      0, 0, 1.0,

      0, 0, 1.0,
      1.0, -1.0, 0,
      0.5, 0.5, 0,
    ]))
    .setType(Accessor.Type.VEC3)
    .setBuffer(buffer)

  const primitive = doc.createPrimitive().setAttribute("POSITION", positions)
  const mesh = doc.createMesh("tetraMesh").addPrimitive(primitive)
  const node = doc.createNode("tetra").setMesh(mesh)

  doc.createScene().addChild(node)

  const times = doc.createAccessor("times")
    .setArray(new Float32Array([0, 1, 2, 3, 4, 5]))
    .setType(Accessor.Type.SCALAR)
    .setBuffer(buffer)

  const positionAccessor = doc.createAccessor("positions")
    .setArray(new Float32Array([
      0, 0, 0,
      1, 0, 0,
      0, 1, 0,
      -1, 0, 0,
      0, -1, 0,
      0, 0, 0,
    ]))
    .setType(Accessor.Type.VEC3)
    .setBuffer(buffer)

  const positionSampler = doc.createAnimationSampler("positionSampler")
    .setInput(times)
    .setOutput(positionAccessor)
    .setInterpolation("LINEAR")

  const positionChannel = doc.createAnimationChannel("positionChannel")
    .setTargetNode(node)
    .setTargetPath("translation")
    .setSampler(positionSampler)

  const rotationAccessor = doc.createAccessor("rotations")
    .setArray(new Float32Array([
      0, 0, 0, 1,
      1, 0, 0, 1,
      0, 1, 0, 1,
      -1, 0, 0, 1,
      0, -1, 0, 1,
      0, 0, 0, 1
    ]))
    .setType(Accessor.Type.VEC4)
    .setBuffer(buffer)

  const rotationSampler = doc.createAnimationSampler("rotationSampler")
    .setInput(times)
    .setOutput(rotationAccessor)
    .setInterpolation("LINEAR")

  const rotationChannel = doc.createAnimationChannel("rotationChannel")
    .setTargetNode(node)
    .setTargetPath("rotation")
    .setSampler(rotationSampler)

  doc.createAnimation("animation")
    .addChannel(positionChannel)
    .addSampler(positionSampler)
    .addChannel(rotationChannel)
    .addSampler(rotationSampler)

  const io = new NodeIO()
  io.write("tetra.glb", doc)
}

createAnimatedTetra()