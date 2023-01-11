import { useState } from "react"
import { Button, ButtonGroup, Input, Label, Row, Spinner } from "reactstrap"
import { useUploader } from "@w3ui/react-uploader"
import { EncryptionLogin, EncryptDecrypt } from "./EncryptionLogin"
import UploadLogin from "./UploadLogin"
import { useKeyring } from "@w3ui/react-keyring"

export default function FileUpload() {
  const [loading, setLoading] = useState(false)
  const [{ space }] = useKeyring()
  const [crypto, setEncrypt] = useState<EncryptDecrypt | null>(null)
  const [, uploader] = useUploader()
  const [file, setFile] = useState<File | null>(null)
  const [contractAddress, setContractAddress] = useState(
    "0x25ed58c027921E14D86380eA2646E3a1B5C55A8b"
  )
  const [tokensRequired, setTokensRequired] = useState(0)
  const [nftRequired, setNftRequired] = useState(false)
  const [cid, setCid] = useState("")

  async function handleUpload() {
    if (!file) return
    setLoading(true)
    let fileForUpload: Blob = file

    if (crypto) {
      const accessControlConditions = []

      if (tokensRequired > 0)
        accessControlConditions.push({
          standardContractType: "ERC20",
          contractAddress,
          chain: "ethereum",
          method: "balanceOf",
          parameters: [":userAddress"],
          returnValueTest: {
            comparator: ">",
            value: tokensRequired.toString(),
          },
        })

      if (nftRequired && tokensRequired)
        accessControlConditions.push({ operator: "or" })

      if (nftRequired)
        accessControlConditions.push({
          standardContractType: "ERC721",
          chain: "ethereum",
          contractAddress,
          method: "balanceOf",
          parameters: [":userAddress"],
          returnValueTest: { comparator: ">", value: "0" },
        })

      fileForUpload = await crypto?.encrypt(file, accessControlConditions)
    }

    if (!fileForUpload) return

    const cid = await uploader.uploadFile(fileForUpload)

    setLoading(false)
    setCid(cid.toString())
  }

  const uploadEnabled = space?.registered()
  const encryptionEnabled = !!crypto

  return (
    <>
      <Row>
        <ButtonGroup size="lg">
          <EncryptionLogin onLogin={(crypto) => setEncrypt(crypto)} />
          <UploadLogin />
        </ButtonGroup>
      </Row>
      <br />
      {uploadEnabled && (
        <Row>
          <Label>
            File
            <Input
              type="file"
              onChange={(e) => {
                e.target.files && setFile(e.target.files[0])
              }}
            />
          </Label>
        </Row>
      )}
      {uploadEnabled && encryptionEnabled && (
        <>
          <Row>
            <Label>
              Smart Contract Address
              <Input
                type="text"
                value={contractAddress}
                placeholder="0x0"
                onChange={(e) => setContractAddress(e.target.value)}
              />
            </Label>
          </Row>
          <Row>
            <Label>
              Required Token Amount in Wei
              <Input
                type="number"
                placeholder="0"
                onChange={(e) => setTokensRequired(parseFloat(e.target.value))}
              />
            </Label>
          </Row>
          <Row>
            <Label>
              <Input
                type="checkbox"
                onChange={(e) => setNftRequired(e.target.checked)}
              />
              {" NFT Required"}
            </Label>
          </Row>
        </>
      )}
      <br />
      {uploadEnabled && (
        <Row>
          <Button
            onClick={handleUpload}
            color="primary"
            block
            size="lg"
            disabled={!file || loading}
          >
            📤 Upload {loading && <Spinner size="sm" />}
          </Button>
        </Row>
      )}
      <br />
      {cid && (
        <a
          href={`${window.location.href}#${cid}`}
          rel="noreferrer"
          target="_blank"
        >
          Open download page!
        </a>
      )}
    </>
  )
}
