import {MainPage} from "../MainPage"
import {Outlet, Route, Routes, useNavigate} from "react-router-dom";
import {ActionIcon, AppShell, Footer, Group, Header, Text, Title, useMantineColorScheme} from "@mantine/core";
import {Form} from "../Form";
import {MoonStars, Sun} from 'tabler-icons-react';
import {Admin} from "../Admin";

export const Root = () => {
    return(
        <Routes>
            <Route element={<Layout/>}>
                <Route path="/" element={ <MainPage/> }/>
                <Route path="/form" element={ <Form/>} />
                <Route path="/admin" element={ <Admin/>} />
            </Route>
            {/*<Route path="*" element={ <PageNotFound/> }/>*/}
        </Routes>
    );
}

const Layout = () => {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';
    const navigate = useNavigate();

    return (
        <AppShell
            fixed
            header={
                <Header height={70} p={ "xs" }>
                    <Group position={"apart"}>
                            <Title
                                order={2}
                                onClick={() => {navigate("/")}}
                                style={{cursor: 'pointer'}}>
                                Reimbursement Calculation App</Title>
                            <ActionIcon
                                variant="outline"
                                color={dark ? 'yellow' : 'blue'}
                                onClick={() => toggleColorScheme()}
                                title="Toggle color scheme"
                            >
                                {dark ? <Sun size={18} /> : <MoonStars size={18} />}
                            </ActionIcon>
                    </Group>
                </Header>
            }
            footer={
                <Footer fixed height={70} p={ "xs" }>
                    <Group position={"right"}>
                        <Text>Created by Patryk Kłosiński</Text>
                    </Group>
                </Footer>
            }
        >
            <Outlet/>
        </AppShell>
    );
}