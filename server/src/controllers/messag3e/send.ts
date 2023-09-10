interface Options {
  content: string;
  conversationId: string;
  memberId: string;
}
type BufferElement = {
  content: string;
  conversationId: string;
  memberId: string;
};

const bufferSize = 10;
let buffer: BufferElement[] = [];
const saveMsgToDb = async ({ content, conversationId, memberId }: Options) => {
  // buffer.push({
  //   content: content,
  //   conversationId: conversationId,
  //   memberId: memberId,
  // });

  // console.log("bufferIs", buffer);

  try {
    await prisma.directMessage.create({
      data: {
        content: content,
        conversationId: conversationId,
        memberId: memberId,
      },
    });
  } catch (error) {
    console.log("error while saving");
  }
  // try {
  //   await prisma.directMessage.createMany({
  //     data: buffer,
  //   });

  //   buffer = [];
  // } catch (error) {
  //   console.log("error while saving");
  // }
};

export default saveMsgToDb;
