import { useEffect, useState } from "react"
import { Button, ButtonGroup, Input, Label } from "reactstrap"
import { useKeyring } from "@w3ui/react-keyring"
import Modal from "./Modal"

export default function UploadLogin() {
  const [showModal, setShowModal] = useState(false)
  const [
    { space },
    { loadAgent, createSpace, registerSpace, cancelRegisterSpace },
  ] = useKeyring()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadAgent()
  }, [loadAgent])

  const uploadEnabled = space?.registered()

  async function handleLogin(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault()
    setLoading(true)
    try {
      await createSpace()
      await registerSpace(email)
    } catch (err) {
      throw new Error("failed to register", { cause: err })
    } finally {
      setLoading(false)
      setShowModal(false)
    }
  }

  return (
    <>
      <Button
        color="primary"
        outline={!uploadEnabled}
        onClick={() => setShowModal(true)}
        disabled={uploadEnabled}
      >
        🗄️ {uploadEnabled ? "W3UP Connected" : "Connect W3UP"}
      </Button>
      <Modal title="Enter W3UP Email" isOpen={showModal}>
        <Label>
          Email
          <Input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </Label>
        <ButtonGroup>
          <Button onClick={handleLogin} color="primary" disabled={loading}>
            Submit
          </Button>
          <Button
            onClick={() => {
              if (loading) cancelRegisterSpace()
              setShowModal(false)
            }}
          >
            Cancel
          </Button>
        </ButtonGroup>
      </Modal>
    </>
  )
}
