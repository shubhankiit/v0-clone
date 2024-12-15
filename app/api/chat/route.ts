// import { StreamingTextResponse, LangChainStream } from 'ai'
// import { ChatOpenAI } from 'langchain/chat_models/openai'
// import { AIMessage, HumanMessage } from 'langchain/schema'

// export const runtime = 'edge'

// export async function POST(req: Request) {
//   const { messages } = await req.json()

//   const { stream, handlers } = LangChainStream()

//   const llm = new ChatOpenAI({
//     modelName: 'gpt-3.5-turbo',
//     streaming: true,
//   })

//   llm.call(
//     messages.map((m: any) => m.role === 'user' ? new HumanMessage(m.content) : new AIMessage(m.content)),
//     {},
//     [handlers]
//   )

//   return new StreamingTextResponse(stream)
// }
