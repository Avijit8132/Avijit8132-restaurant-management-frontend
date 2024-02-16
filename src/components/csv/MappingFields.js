import React, { useState, useEffect } from "react";
import { Button, Col, Row, Table } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";

const MappingFields = ({ csvDataAligned, fields, onUpdate }) => {

    const [showModal, setShowModal] = useState(false);
    const [indexValue, setIndex] = useState();
    const [sendPrent, setSendParent] = useState();
    const [selectedField, setSelectedField] = useState();
    function mapFields(ele) {
        setSelectedField(ele)
        var temp = [];
        csvDataAligned.forEach((e, index) => {
            var tempRec;
            tempRec = { ...e };
            if (indexValue === index) {
                tempRec.mappedFields = ele
                tempRec.edit = true
            }
            temp.push(tempRec);
        })
        setSendParent(temp)

    }

    return (
        <>
            <Table>
                <thead>
                    <tr>
                        <th>Edit</th>
                        <th>Mapped Fields</th>
                        <th>CSV Header</th>
                    </tr>
                </thead>
                <tbody>
                    {csvDataAligned && csvDataAligned.map((e, index) =>
                        <tr>
                            <td >{e.edit ? <button class="btn btn-link" onClick={() => { setIndex(index); setShowModal(true); setSelectedField(e.mappedFields) }}>Change</button> : <button class="btn btn-link" onClick={() => { setIndex(index); setShowModal(true); setSelectedField() }}>Map</button>}</td>
                            <td >{e.mappedFields}</td>
                            <td >{e.csvHeader}</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <Modal show={showModal} size="" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">Fields</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h6>Selected Field : {selectedField}</h6>

                    {fields.map(e =>
                        <div style={{
                            border: "solid 1px antiquewhite",
                            textTransform: "uppercase",
                            padding: "6px"
                        }}
                            onClick={() => mapFields(e.unique)}
                        >
                            {e.label}
                            <span className={selectedField === e.unique ? "checkmark" : ""}></span>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>

                    <Button variant="success" onClick={() => { onUpdate(sendPrent); setShowModal(false) }}>
                        Update
                    </Button>
                    <Button onClick={() => setShowModal(false)} variant="light">
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default MappingFields