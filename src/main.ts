import {
  Document,
  NodeIO,
  Accessor,
} from "@gltf-transform/core"

async function createAnimatedTetra() {
  const doc = new Document();
  const buffer = doc.createBuffer("dataBuffer")

  const verts = doc.createAccessor("verts")
    .setArray(new Float32Array([
      -1, -1, 0,
      1, -1, 0,
      0, 1, 0,
      0, 0, 1,
    ]))
    .setType(Accessor.Type.VEC3)
    .setBuffer(buffer)

  const indices = doc.createAccessor("indices")
    .setArray(new Uint8Array([
      0, 2, 1,
      0, 1, 3,
      1, 2, 3,
      2, 0, 3,
    ]))
    .setType(Accessor.Type.SCALAR)
    .setBuffer(buffer)

  const primitive = doc.createPrimitive().setAttribute("POSITION", verts).setIndices(indices)
  const mesh = doc.createMesh("tetraMesh").addPrimitive(primitive)
  const node = doc.createNode("tetra").setMesh(mesh)

  doc.createScene().addChild(node)

  const times = doc.createAccessor("times")
    .setArray(new Float32Array([0, 1, 2, 3, 4, 5]))
    .setType(Accessor.Type.SCALAR)
    .setBuffer(buffer)

  const positionAccessor = doc.createAccessor("positions")
    .setArray(new Float32Array([
      0, 1, 0,
      0, -1, 0,
      0, 1, 0,
      0, -1, 0,
      0, 1, 0,
      0, 1, 0,
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
      0, 0.7071068, 0, 0.7071068, //  90 degree around y
      0, 1, 0, 0,                 // 180 degree around y
      0, 0.7071068, 0, -0.7071068,// 270 degree around y
      0, 0, 0, -1,                // 360 degree around y
      0, 0, 0, -1                 // 360 degree around y
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