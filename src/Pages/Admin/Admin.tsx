import {Button, Card, Group, NumberInput, Stack, TextInput, Title} from "@mantine/core";
import {BsPatchMinusFill} from "react-icons/bs";
import {useEffect, useState} from "react";

interface receipts {
    [index: number]: {
        type: string | undefined;
        price: number;
    };
}

interface metadata {
    allowanceRate: number;
    maxReimbursement: number;
    mileageRate: number;
    receipts: receiptsMeta;
}

interface receiptsMeta {
    [index: string]: number;
}

export const Admin = () => {
    const [allowanceRate, setAllowanceRate] = useState(.0);
    const [mileageRate, setMileageRate] = useState(.0);
    const [maxReimbursement, setMaxReimbursement] = useState(.0);
    const [receiptsMeta, setReceiptsMeta] = useState<receiptsMeta>({});

    const loadMetadata = async () => {
        await fetch("/api/metadata", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                if (!response.ok) throw Error(response.status.toString());
                return response.json();
            })
            .then((data: metadata) => {
                setAllowanceRate(data.allowanceRate);
                setMileageRate(data.mileageRate);
                setMaxReimbursement(data.maxReimbursement);
                setReceiptsMeta(data.receipts);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const saveMetadata = async () => {
        const metadata: metadata = {
            receipts: receiptsMeta,
            allowanceRate: allowanceRate,
            mileageRate: mileageRate,
            maxReimbursement: maxReimbursement
        };
        await fetch(`/api/metadata`, {
            method: 'POST',
            body: JSON.stringify(metadata),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                if (!response.ok) throw Error(response.status.toString());
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const changeReceiptType = (key: string, newKey: string | null) => {
        if(newKey !== null && !(newKey in receiptsMeta)) {
            const newReceipts: receiptsMeta = {};
            for(const field in receiptsMeta) {
                if(field === key) {
                    newReceipts[newKey] = receiptsMeta[field];
                }
                else {
                    newReceipts[field] = receiptsMeta[field];
                }
            }
            setReceiptsMeta(newReceipts);
        }
    }

    const changeReceiptPrice = (key: string, value: number | undefined) => {
        if(value) {
            const receiptsMetaCopy = Object.assign({}, receiptsMeta);
            receiptsMetaCopy[key] = value;
            setReceiptsMeta(receiptsMetaCopy);
        }
    }

    const addReceiptMeta = () => {
        const receiptsMetaCopy = Object.assign({}, receiptsMeta);
        receiptsMetaCopy[""] = 0;
        setReceiptsMeta(receiptsMetaCopy);
    }

    const deleteReceiptMeta = (key: string) => {
        const receiptsMetaCopy = Object.assign({}, receiptsMeta);
        delete receiptsMetaCopy[key];
        setReceiptsMeta(receiptsMetaCopy);
    }

    useEffect(() => {
        loadMetadata();
    }, [])

    return (
        <Group position={"center"}>
            <Stack>
                <Card withBorder>
                    <Stack>
                        <Title order={3}>Change rates</Title>
                        <form>
                            <Group position={"left"} mb={20}>
                                <NumberInput
                                    required
                                    value={allowanceRate}
                                    placeholder={"Daily allowance"}
                                    label={"Daily allowance"}
                                    hideControls
                                    onChange={(value) => (value ? setAllowanceRate(value) : "")}
                                />
                                <NumberInput
                                    required
                                    value={maxReimbursement}
                                    placeholder={"Max Reimbursement"}
                                    label={"Max Reimbursement"}
                                    hideControls
                                    onChange={(value) => (value ? setMaxReimbursement(value) : "")}
                                />
                                <NumberInput
                                    required
                                    value={mileageRate}
                                    placeholder={"Car mileage"}
                                    label={"Car mileage"}
                                    min={0}
                                    precision={2}
                                    step={0.05}
                                    onChange={(value) => (value ? setMileageRate(value) : "")}
                                />
                            </Group>
                            <Group position={"right"}>
                                <Button type={"submit"} onClick={saveMetadata}>Change</Button>
                            </Group>
                        </form>
                    </Stack>
                </Card>
                <Card withBorder>
                    <Stack>
                        <Title order={3}>Edit receipt</Title>
                        <form>
                            <>
                                {Object.keys(receiptsMeta).map((item, i) => (
                                    <Group key={i} position={"left"} mb={20}>
                                        <TextInput
                                            value={item}
                                            placeholder={"Name of receipts"}
                                            label={"Type of receipts"}
                                            required
                                            onChange={(event) => changeReceiptType(item, event.target.value)}
                                        />
                                        <NumberInput
                                            value={receiptsMeta[item]}
                                            placeholder={"Max value"}
                                            label={"Max value of reimbursement"}
                                            min={0}
                                            hideControls
                                            onChange={(value) => changeReceiptPrice(item, value)}
                                        />
                                        <BsPatchMinusFill
                                            style={{cursor: "pointer", marginTop: 25}}
                                            onClick={() => deleteReceiptMeta(item)}
                                        />
                                    </Group>
                                ))}
                                <Group position={"apart"}>
                                    <Button
                                        onClick={addReceiptMeta}
                                        disabled={"" in receiptsMeta}
                                    >
                                        Add
                                    </Button>
                                    <Button onClick={saveMetadata} type={"submit"}>Save</Button>
                                </Group>
                            </>
                        </form>
                    </Stack>
                </Card>
            </Stack>
        </Group>
    );
}