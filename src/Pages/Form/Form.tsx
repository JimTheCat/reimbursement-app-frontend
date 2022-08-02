import {Button, Card, Group, NumberInput, Select, Text, Title, Tooltip} from "@mantine/core";
import {useEffect, useState} from "react";
import {DateRangePicker} from "@mantine/dates";
import {BsInfoLg} from "react-icons/bs";


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

interface order {
    receipts: receipts;
    allowance: number;
    allowanceRate: number;
    mileage: number;
    mileageRate: number;
    sumOfCosts: number;
}

export const Form = () => {
    const [allowanceRate, setAllowanceRate] = useState(.0);
    const [mileageRate, setMileageRate] = useState(.0);
    const [maxReimbursement, setMaxReimbursement] = useState(.0);
    const [receiptsMeta, setReceiptsMeta] = useState<receiptsMeta>({});

    const [sumOfCosts, setSumOfCosts] = useState(0);

    const [numberOfReceipts, setNumberOfReceipts] = useState(0);
    const [receipts, setReceipts] = useState<receipts>({});
    const [allowance, setAllowance] = useState(0);
    const [mileage, setMileage] = useState(0);

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

    const saveForm = async () => {
        const order: order = {
            receipts: receipts,
            allowance: allowance,
            allowanceRate: allowanceRate,
            mileage: mileage,
            mileageRate: mileageRate,
            sumOfCosts: sumOfCosts
        };
        await fetch(`/api/form`, {
            method: 'POST',
            body: JSON.stringify(order),
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

    const addReceipt = () => {
        if (numberOfReceipts < 5) {
            const newReceipt = numberOfReceipts + 1;
            setNumberOfReceipts(newReceipt);
            receipts[numberOfReceipts] = {type: undefined, price: 0};
        }
    }

    const removeReceipt = () => {
        if (numberOfReceipts > 0) {
            delete receipts[numberOfReceipts - 1];
            setNumberOfReceipts(numberOfReceipts-1);
        }
    }

    const refreshCost = () => {
        let sumOfReceipts = .0;
        for (let receiptsKey in receipts) {
            sumOfReceipts += receipts[receiptsKey].price;
        }
        const allowanceCost = allowance * allowanceRate;
        const mileageCost = mileage * mileageRate;
        let sumOfCosts = sumOfReceipts + allowanceCost + mileageCost;
        sumOfCosts = sumOfCosts > maxReimbursement ? maxReimbursement : sumOfCosts;
        setSumOfCosts(Math.round(sumOfCosts * 100) / 100);
    }

    const calculateAllowance = (start: Date | null, end: Date | null) => {
        if(start && end) {
            return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        }
        return 0;
    }

    const changeReceiptType = (key: number, value: string | null) => {
        if(value) {
            const receiptsCopy = Object.assign({}, receipts);
            receiptsCopy[key].type = value;
            receiptsCopy[key].price = 0;
            setReceipts(receiptsCopy);
        }
    }

    const changeReceiptPrice = (key: number, value: number | undefined) => {
        if(value) {
            const receiptsCopy = Object.assign({}, receipts);
            receiptsCopy[key].price = value;
            setReceipts(receiptsCopy);
        }
    }

    const getMaxForType = (key: number) => {
        if(key in receipts) {
            const type = receipts[key].type;
            return type ? receiptsMeta[type] : 0;
        }
        return 0;
    }

    const getPlaceholder = (key: number) => {
        if(key in receipts) {
            const type = receipts[key].type;
            return type ? `Max: ${receiptsMeta[type]}` : "Price"
        }
        return "Price";
    }

    const getPriceOfReceipt = (key: number) => {
        if(key in receipts) {
            const price = receipts[key].price;
            return price ? price : undefined
        }
        return undefined;
    }

    useEffect(() => {
        loadMetadata();
        refreshCost();
    }, [receipts, allowance, mileage])

    return (
        <Card mx="auto" sx={{maxWidth: '50vw'}}>
            <Title order={3} mb={15}>Add new claim</Title>
            <form>
                <Group position={"left"} mb={"xs"}>
                    <DateRangePicker
                        label={<>Business trip period <Tooltip label={`with ${allowanceRate}$/day rate`}><BsInfoLg /></Tooltip></>}
                        placeholder={"Pick dates range"}
                        onChange={([start, end]) => setAllowance(calculateAllowance(start, end))}
                    />
                    <NumberInput
                        defaultValue={0}
                        placeholder={"Personal car mileage"}
                        label={<>Personal car mileage <Tooltip label={`with ${mileageRate}$/km rate`}><BsInfoLg /></Tooltip></>}
                        hideControls
                        onChange={(value) => value !== undefined ? setMileage(value) : setMileage(0)}
                    />
                </Group>
                {[...Array(numberOfReceipts)].map((item, i) => (
                    <Group key={i} position={"left"} mb={"xs"}>
                        <Select
                            required
                            label={"Type of receipt"}
                            placeholder="Pick one"
                            data={Object.keys(receiptsMeta).map((item, i) => (
                                    {value: item, label: item}
                                ))}
                            onChange={(value) => changeReceiptType(i, value)}
                        />
                        <NumberInput
                            required
                            placeholder={getPlaceholder(i)}
                            label={"Price"}
                            max={getMaxForType(i)}
                            disabled={receipts[i].type === undefined}
                            hideControls
                            onChange={(value) => changeReceiptPrice(i, value)}
                            value={getPriceOfReceipt(i)}
                        />
                        </Group>
                    ))}
                <Group position={"right"}>
                    <Text>Total cost: {sumOfCosts}</Text>
                </Group>
                <Group position={"right"}>
                    <Text>Available max is: {maxReimbursement}</Text>
                </Group>
                <Group position="apart" mt="md">
                    <Group position={"left"}>
                        <Button disabled={numberOfReceipts === 5} onClick={addReceipt}>Add Receipt</Button>
                        <Button disabled={numberOfReceipts === 0} onClick={removeReceipt}>Remove Receipt</Button>
                    </Group>
                    <Button type="submit" onClick={saveForm}>Submit</Button>
                </Group>
            </form>
        </Card>
    );
}