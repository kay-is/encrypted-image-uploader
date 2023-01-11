import { Button } from "reactstrap"
import { CHAIN_NAMESPACES } from "@web3auth/base"
import { useEffect } from "react"
//@ts-expect-error
import LitJsSdk from "@lit-protocol/sdk-browser"
import { providers } from "ethers"
import useWeb3Auth from "../hooks/useWeb3Auth"
import useLitClient from "../hooks/useLitClient"

const web3authOptions = {
  clientId: "...",
  chainConfig: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x1",
    rpcTarget: "https://rpc.ankr.com/eth",
  },
}

export type Encrypter = (
  file: File,
  accessControlConditions: any
) => Promise<Blob>
export type Decrypter = (file: Blob) => Promise<File>
export interface EncryptDecrypt {
  encrypt: Encrypter
  decrypt: Decrypter
}

export interface EncryptionLoginProps {
  onLogin: ({ encrypt, decrypt }: EncryptDecrypt) => void
}

export function EncryptionLogin(props: EncryptionLoginProps) {
  const litNodeClient = useLitClient()
  const web3auth = useWeb3Auth(web3authOptions)

  async function handleLogin() {
    if (!web3auth) return
    await web3auth.connect()
  }

  const encryptionEnabled = !!web3auth?.provider

  useEffect(() => {
    async function initEncryption() {
      if (!web3auth || !web3auth.provider) return

      const provider = new providers.Web3Provider(web3auth.provider)
      const network = await provider.getNetwork()
      const userAddress = (
        await provider.getSigner().getAddress()
      ).toLowerCase()

      async function encrypt(file: File, accessControlConditions: any) {
        const authSig = await LitJsSdk.signAndSaveAuthMessage({
          web3: provider,
          account: userAddress,
          chainId: network.chainId,
        })

        if (accessControlConditions.length > 0)
          accessControlConditions.push({ operator: "or" })

        accessControlConditions.push({
          contractAddress: "",
          standardContractType: "",
          chain: "ethereum",
          method: "",
          parameters: [":userAddress"],
          returnValueTest: { comparator: "=", value: userAddress },
        })

        const { zipBlob } = await LitJsSdk.encryptFileAndZipWithMetadata({
          litNodeClient,
          chain: "ethereum",
          authSig,
          accessControlConditions,
          file,
        })

        return zipBlob<Blob>
      }

      async function decrypt(file: Blob) {
        const authSig = await LitJsSdk.signAndSaveAuthMessage({
          web3: provider,
          account: userAddress,
          chainId: network.chainId,
        })

        const { decryptedFile, metadata } =
          await LitJsSdk.decryptZipFileWithMetadata({
            litNodeClient,
            authSig,
            file,
          })

        return new File([decryptedFile], metadata.name, { type: metadata.type })
      }

      props.onLogin({ encrypt, decrypt })
    }

    initEncryption()
  }, [encryptionEnabled, litNodeClient, props, web3auth])

  return (
    <>
      <Button onClick={handleLogin} color="info" disabled={encryptionEnabled}>
        👛 {encryptionEnabled ? "Wallet Connected" : "Connect Wallet"}
      </Button>
    </>
  )
}
