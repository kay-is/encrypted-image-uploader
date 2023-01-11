import { useEffect, useState } from "react"
//@ts-expect-error
import LitJsSdk from "@lit-protocol/sdk-browser"

export default function useLitClient() {
  const [litNodeClient, setLitClient] = useState<LitJsSdk.LitNodeClient | null>(
    null
  )

  useEffect(() => {
    async function initLit() {
      const litNodeClient = new LitJsSdk.LitNodeClient()
      await litNodeClient.connect()
      setLitClient(litNodeClient)
    }
    initLit()
  }, [])

  return litNodeClient
}
