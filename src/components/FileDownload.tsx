import { Button, ButtonGroup, Row, Spinner } from "reactstrap"
import { EncryptionLogin, EncryptDecrypt } from "./EncryptionLogin"
import { useState } from "react"

function startDownload(file: File) {
  const a = document.createElement("a")
  a.style.display = "none"
  document.body.appendChild(a)
  a.href = window.URL.createObjectURL(file)
  a.setAttribute("download", file.name)
  a.click()
  window.URL.revokeObjectURL(a.href)
  document.body.removeChild(a)
}

export default function FileDownload() {
  const [loading, setLoading] = useState(false)
  const [crypto, setDecrypt] = useState<EncryptDecrypt | null>(null)

  async function handleDownload() {
    if (!crypto) return
    setLoading(true)

    const cid = window.location.hash.substring(1)
    const response = await fetch(`https://w3s.link/ipfs/${cid}`)
    const encryptedFile = await response.blob()
    const decryptedFile = await crypto.decrypt(encryptedFile)

    setLoading(false)
    startDownload(decryptedFile)
  }

  return (
    <Row>
      <ButtonGroup size="lg">
        <EncryptionLogin onLogin={(crypto) => setDecrypt(crypto)} />
        <Button
          onClick={handleDownload}
          color="primary"
          disabled={!crypto || loading}
        >
          📥 Download & Decrypt File {loading && <Spinner size="sm" />}
        </Button>
      </ButtonGroup>
    </Row>
  )
}
