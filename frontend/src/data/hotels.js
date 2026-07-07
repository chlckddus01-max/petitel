// 백엔드 호텔 검색 API가 아직 없어서, 호텔 목록/상세 페이지가 함께 쓰는 임시 mock 데이터.
// 나중에 실제 API로 교체할 때 이 파일만 지우고 fetch로 바꾸면 된다.

export const FACILITIES = [
    { id: 'self_checkin', label: '자율체크인', icon: 'badge' },
    { id: '24h', label: '24시간', icon: 'schedule' },
    { id: 'grooming', label: '미용', icon: 'content_cut' },
    { id: 'pickup', label: '픽업', icon: 'directions_car' },
]

export const HOTELS = [
    {
        id: 1,
        name: '멍냥스테이 강남점',
        address: '서울 강남구',
        rating: 4.8,
        reviewCount: 132,
        tags: ['24시간 상주', 'CCTV', '야외테라스'],
        pricePerNight: 45000,
        listBadge: 'HOT DEAL',
        tier: 'PREMIUM',
        wishlisted: true,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLYS09yPr64_vryRyMPBBTNlRS3gYV0oKvuK5PsxnTIm8JxSWbpsowFohfTWXwRr5lctU5lgRFJ_CLX32qJS9unHgyVgojDtOxy5JDh9gRWdd4jze__w9b3kd4GSAhxmdHyIXc78WKD-ZZXXwfUfiQTj6cgbWk61dr3fj7wAmafVtJvzst_PYKSStHlsckevoITQaKoJVvbArvNnjPZFiq4DQwSV_e4anjAiyECwW5vgmYUtK1WMxb7vpWQTFjubsj93pB3FpQkkTi',
        facilityIds: ['self_checkin', '24h', 'grooming', 'pickup'],
        rooms: [
            { name: '스탠다드룸', capacityLabel: '최대 5kg | 1견 기준', sizeTag: 'Small', price: 45000 },
            { name: '디럭스룸', capacityLabel: '최대 12kg | 1견 기준', sizeTag: 'Medium', price: 68000 },
        ],
        reviews: [
            { reviewer: '김*지', rating: 5, content: '강남에서 여기만한 곳이 없어요! 시설 너무 깨끗하고 선생님들이 너무 친절하셔서 안심하고 맡겼습니다.' },
            { reviewer: '이*혁', rating: 4, content: '24시간 케어해주시는 점이 제일 마음에 들어요. 사진도 자주 보내주시고 서비스 만족합니다.' },
        ],
    },
    {
        id: 2,
        name: '더 펫 부티크 청담',
        address: '서울 강남구 청담동',
        rating: 4.9,
        reviewCount: 86,
        tags: ['프라이빗룸', '픽업서비스'],
        pricePerNight: 82000,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrYQVHpOAiNBJww2-mDcC4DJQwn4JBjV2smiiw-sErmzbiZEm6uVtr9Lqb83Mtl_qNeR149lCh8WCSeqMY0RqAxLFv1272J9xh1RfQTWeZF7nvABBV1uglBqyl1LHGCkYvFzxxeYpb0CrIH0hU2b7HhIMHyNd-KFrdT_NnWp6pVDDPjR1C1-N8C9hKLPVFZdjUsPAAHaGpzGznRMIjYzgdnK_4Oj9umk9iKvn9cgN9wE3r5gIypdii6nH36U-sStXHH74FFItxU1mX',
        facilityIds: ['self_checkin', 'grooming', 'pickup'],
        rooms: [
            { name: '프라이빗룸', capacityLabel: '최대 7kg | 1견 기준', sizeTag: 'Small', price: 82000 },
            { name: '스위트룸', capacityLabel: '최대 15kg | 2견 기준', sizeTag: 'Large', price: 128000 },
        ],
        reviews: [
            { reviewer: '박*영', rating: 5, content: '청담동에 이런 프라이빗한 펫 호텔이 있는지 몰랐어요. 공간이 정말 고급스럽습니다.' },
            { reviewer: '최*민', rating: 5, content: '픽업 서비스 덕분에 바쁜 평일에도 편하게 맡길 수 있었어요.' },
        ],
    },
    {
        id: 3,
        name: '펫파라다이스 신사',
        address: '서울 강남구 신사동',
        rating: 4.7,
        reviewCount: 214,
        tags: ['미용서비스', '대형견가능'],
        pricePerNight: 55000,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAef_Znk8cHugtKkbd_sw3lntNh58hTdUtxI_rxjZciXl6oPWVFPIUQKnTnjphOPLnhdj8C-oJ8i5Fzxvta4tKRVh9p8CXddqYO0juocCd7jzuquX0txoK6VR4mew6zJ4E53aMrk3glJURdIIgjW8W0HeIVSK7JXdHOiTix34t5YzlgG-8-bJyT8oDepszOlpe5YTOfq2bcDDVYGHUTFaXFrbNVfS9kqslqcsk3BV1uMrYg-ewzCLPF8fN1BaTrZL9X3Rf_8MVkM-c-',
        facilityIds: ['24h', 'grooming'],
        rooms: [
            { name: '스탠다드룸', capacityLabel: '최대 10kg | 1견 기준', sizeTag: 'Medium', price: 55000 },
            { name: '대형견룸', capacityLabel: '최대 30kg | 1견 기준', sizeTag: 'Large', price: 89000 },
        ],
        reviews: [
            { reviewer: '정*수', rating: 5, content: '대형견도 편하게 받아주는 곳이 드문데 여기는 공간이 넓어서 좋았어요.' },
            { reviewer: '한*미', rating: 4, content: '미용까지 같이 맡길 수 있어서 시간이 절약됐습니다.' },
        ],
    },
    {
        id: 4,
        name: '그랜드 펫텔 서초',
        address: '서울 서초구',
        rating: 4.6,
        reviewCount: 98,
        tags: ['건강검진', '발렛파킹'],
        pricePerNight: 68000,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLYS09yPr64_vryRyMPBBTNlRS3gYV0oKvuK5PsxnTIm8JxSWbpsowFohfTWXwRr5lctU5lgRFJ_CLX32qJS9unHgyVgojDtOxy5JDh9gRWdd4jze__w9b3kd4GSAhxmdHyIXc78WKD-ZZXXwfUfiQTj6cgbWk61dr3fj7wAmafVtJvzst_PYKSStHlsckevoITQaKoJVvbArvNnjPZFiq4DQwSV_e4anjAiyECwW5vgmYUtK1WMxb7vpWQTFjubsj93pB3FpQkkTi',
        facilityIds: ['self_checkin', '24h', 'pickup'],
        rooms: [
            { name: '스탠다드룸', capacityLabel: '최대 8kg | 1견 기준', sizeTag: 'Small', price: 68000 },
            { name: '프리미엄룸', capacityLabel: '최대 15kg | 1견 기준', sizeTag: 'Medium', price: 95000 },
        ],
        reviews: [
            { reviewer: '오*진', rating: 5, content: '건강검진까지 챙겨주셔서 안심이 됐어요. 발렛파킹도 편했습니다.' },
            { reviewer: '남*희', rating: 4, content: '서초에서 접근성 좋고 시설도 깔끔해요.' },
        ],
    },
]

export function getHotelById(id) {
    return HOTELS.find((hotel) => String(hotel.id) === String(id))
}
