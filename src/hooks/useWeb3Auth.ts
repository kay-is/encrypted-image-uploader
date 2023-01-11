import { Web3Auth, Web3AuthOptions } from "@web3auth/modal"
import { useEffect, useState } from "react"

export default function useWeb3Auth(options: Web3AuthOptions) {
  const [web3auth, setWeb3Auth] = useState<null | Web3Auth>(null)

  useEffect(() => {
    async function initWeb3Auth() {
      const web3auth = new Web3Auth(options)
      await web3auth.initModal()
      setWeb3Auth(web3auth)
    }

    initWeb3Auth()
  }, [options])

  return web3auth
}
