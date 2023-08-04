import { Button, Container, Icon, Menu } from "semantic-ui-react";
import Link from "next/link"

function Layout(props) {

    return (
        <>
            <Menu pointing>
                <Menu.Item>
                    <Link href={"/"}>
                        CrowdCampaings
                    </Link>
                </Menu.Item>
                <Menu.Menu position='right'>
                    <Menu.Item>
                        <Link href="/campaings/new">
                            <Button basic color='blue'>
                                <Icon name="plus" /> New Campaign
                            </Button>
                        </Link>
                    </Menu.Item>
                </Menu.Menu>
            </Menu>
            <Container>
                {props.children}
            </Container>
        </>
    )
}

export default Layout;