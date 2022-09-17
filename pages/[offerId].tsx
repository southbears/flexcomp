import { Box, Button, Container, Divider, Heading, HStack, Image, Select, Skeleton, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Stack, Text, Tooltip, VStack } from '@chakra-ui/react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { MdDragIndicator, MdOutlineHelp } from 'react-icons/md';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from 'recharts';
import { SaveModal } from '../src/components/SaveModal';
import { getOffer } from '../src/database';
import { PerkType } from '../src/types';

const usdFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});
const percentFormat = new Intl.NumberFormat('en-US', {
  style: 'percent',
  maximumFractionDigits: 0,
})

const OfferPage: NextPage = () => {
  const router = useRouter();
  const offer = useMemo(() => getOffer(router.query.offerId as string), [router.query.offerId]);

  const [value, setValue] = useState(offer.default);
  const [growthRate, setGrowthRate] = useState((offer.growthProjections.find((p) => p.default) ?? offer.growthProjections[0])?.rate);

  const [minTotal, maxTotal] = [offer.cash.min + offer.equity.max, offer.cash.max + offer.equity.min].sort();

  const cash = offer.cash.min + (offer.cash.max - offer.cash.min) * value;
  const equity = offer.equity.min + (offer.equity.max - offer.equity.min) * (1 - value);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [modalOpen, setModalOpen] = useState(false);

  if (!router.query.offerId) return null;
  return (
    <>
      <Container maxW='container.lg' mt={24}>
        <Stack
          direction={{
            base: 'column',
            lg: 'row',
          }}
          spacing={16}
          p={{
            base: 6,
            lg: 16,
          }}
          borderRadius='xl'
          shadow='2xl'
          bg='white'
        >
          <Box flex={1}>
            <HStack mb={2}>
              <Image src={offer.company.imageUrl} w={6} h={6} borderRadius='full' alt={offer.company.name} />
              <Heading as='h2' size='sm' textTransform='uppercase' opacity={0.5}>{offer.company.name}</Heading>
            </HStack>
            <HStack alignItems='center' mb={8}>
              <Heading flex={1}>
                {offer.candidate.firstName}, here is your offer
              </Heading>
              {/* <Text size='xs' as='b'>Use Default</Text>
              <Switch size='sm' isChecked={value === offer.default} onChange={() => setValue(offer.default)} /> */}
            </HStack>
            <HStack justifyContent='space-between'>
              <Tooltip label='This is the range of your offer. You can choose between how you want to allocate your compensation between base salary and equity below.'>
                <HStack alignItems='center' spacing={1}>
                  <Heading as='h4' size='md'>
                    Total Range
                  </Heading>
                  <MdOutlineHelp opacity={0.5} />
                </HStack>
              </Tooltip>
              <Heading as='h4' size='md'>
                {usdFormat.format(minTotal)} - {usdFormat.format(maxTotal)}
              </Heading>
            </HStack>

            <Divider my={8} />

            <HStack justifyContent='space-between'>
              <Box>
                <HStack>
                  <Text as='b'>Base Salary</Text>
                  <Text as='b' opacity={0.5}>{percentFormat.format(value)}</Text>
                </HStack>
                <Text>
                  {usdFormat.format(cash)}
                </Text>
              </Box>
              <Box>
                <HStack>
                  <Text as='b'>Equity</Text>
                  <Text as='b' opacity={0.5}>{percentFormat.format(1 - value)}</Text>
                </HStack>
                <Text>
                  {usdFormat.format(equity)}
                </Text>
              </Box>
            </HStack>

            <Slider defaultValue={offer.default} value={value} onChange={setValue} min={0} max={1} step={0.01}>
              <SliderTrack h={3} borderRadius='full' bg='blue.700'>
                <SliderFilledTrack bg='blue.400' />
              </SliderTrack>
              <SliderThumb boxSize={8}>
                <Box as={MdDragIndicator} />
              </SliderThumb>
            </Slider>

            <Divider my={8} />

            <HStack justifyContent='space-between' mb={4}>
              <Tooltip label='This is a projection of the value of your total compensation. You can see how different growth rates of the stock impact the overall total compensation.' flex={1}>
                <HStack alignItems='center' spacing={1}>
                  <Heading as='h4' size='md'>
                    Projected Value
                  </Heading>
                  <MdOutlineHelp opacity={0.5} />
                </HStack>
              </Tooltip>
              <Select size='sm' width='auto' value={growthRate} onChange={(e) => setGrowthRate(Number(e.target.value))} borderRadius='md'>
                {offer.growthProjections.map((projection, index) => (
                  <option key={index} value={projection.rate}>{projection.label}</option>
                ))}
              </Select>
            </HStack>
            
            {mounted ? (
              <ResponsiveContainer width='100%' height={(250)}>
                <BarChart data={[
                  {
                    name: 'Year 1',
                    'Base Salary': cash,
                    'Equity': equity,
                    'Bonus': offer.perks.find((p) => p.type === PerkType.SIGNING_BONUS)?.amount.min ?? 0,
                  },
                  {
                    name: 'Year 2',
                    'Base Salary': cash,
                    'Equity': Math.round(equity * growthRate),
                  },
                  {
                    name: 'Year 3',
                    'Base Salary': cash,
                    'Equity': Math.round(equity * growthRate ** 2),
                  },
                  {
                    name: 'Year 4',
                    'Base Salary': cash,
                    'Equity': Math.round(equity * growthRate ** 3),
                  },
                ]}>
                  <CartesianGrid horizontal strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="Base Salary" stackId='1' fill="#486FF9" />
                  <Bar dataKey="Equity" stackId='1' fill="#243EA1" />
                  {/* <Bar dataKey="Bonus" stackId='1' fill="#15255F" /> */}
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Skeleton height={250} />
            )}
          </Box>

          <VStack shadow='2xl' borderRadius='lg' p={4} borderWidth={1} alignItems='stretch' minW='300px' spacing={4}>
            <Heading as='h2' size='md'>
              Summary
            </Heading>
            <HStack justifyContent='space-between'>
              <Text>Base Salary</Text>
              <Text>{usdFormat.format(cash)}</Text>
            </HStack>
            <HStack justifyContent='space-between'>
              <Text>Equity</Text>
              <Text>{usdFormat.format(equity)}</Text>
            </HStack>
            <Divider  />
            {!!offer.perks.length && (
              <>
                {offer.perks.map((perk, index) => (
                  <HStack key={index} justifyContent='space-between'>
                    <Text>{perk.name}</Text>
                    <Text>{usdFormat.format(perk.amount.min)}</Text>
                  </HStack>
                ))}
                <Divider />
              </>
            )}
            <Box flex={1} />
            <HStack justifyContent='space-between' alignItems='center'>
              <Text as='b'>Annual Total</Text>
              <Box>
                <Heading size='lg'>{usdFormat.format(cash + equity)}</Heading>
                <Text fontSize='xs' opacity={0.5} textAlign='center' maxW='240px' mx='auto'>
                  {usdFormat.format((cash + equity) / 12)}/month
                </Text>
              </Box>
            </HStack>

            <Button size='lg' width='full' variant='solid' colorScheme='blue' onClick={() => setModalOpen(true)}>
              Save Offer
            </Button>
            <Box>
              <Text fontSize='xs' opacity={0.5} textAlign='center' maxW='240px' mx='auto'>
                Allocations can only be changed during the open quarterly election windows.
              </Text>
            </Box>
          </VStack>
        </Stack>
      </Container>
      <SaveModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default OfferPage;
