import {Box, Button, Container, Group} from "@mantine/core";
import {useNavigate} from "react-router-dom";

export const MainPage = () => {
    const navigate = useNavigate();

    return (
        <Group spacing={10}>
            <Button onClick={() => {navigate("/form")}}>Add new claim</Button>
            <Button onClick={() => {navigate("/admin")}}>Admin Panel</Button>
        </Group>
    );
}