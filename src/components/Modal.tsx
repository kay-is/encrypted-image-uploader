import { ReactNode } from "react"
import { Modal as BSModal, ModalBody, ModalHeader } from "reactstrap"

export interface ModalOptions {
  isOpen: boolean
  title: string
  children: ReactNode
}

export default function Modal(props: ModalOptions) {
  return (
    <BSModal isOpen={props.isOpen}>
      <ModalHeader>{props.title}</ModalHeader>
      <ModalBody className="d-flex flex-column align-items-stretch">
        {props.children}
      </ModalBody>
    </BSModal>
  )
}
