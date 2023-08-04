import React from 'react'
import { CampaingsDeployed, getCampaigns } from "../services/campaing"
import { GetServerSideProps } from 'next'
import { Button, Card } from 'semantic-ui-react'
import Layout from '../components/Layout'
import Link from 'next/link'

function Index({ campaings }) {

    return (
        <Layout>
            <h2>Open campaings</h2>
            {campaings.address.map(item => {
                return (
                    <Card fluid key={item}>
                        <Card.Content>
                            <Card.Description>
                                <p >Campaing address: {item}</p>
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <div className='ui two buttons'>
                                <Link href={`campaings/${item}`}>
                                    <Button basic color='blue'>
                                        View campaing
                                    </Button>
                                </Link>
                            </div>
                        </Card.Content>
                    </Card>
                )
            })}
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async () => {
    const campaings: CampaingsDeployed = await getCampaigns()
    return { props: { campaings } }
}

export default Index;