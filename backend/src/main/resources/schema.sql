-- gen_random_uuid()는 PostgreSQL 13부터 pg_catalog(코어)에 내장된 함수라 pgcrypto 확장이 필요 없다.
-- (예전엔 pgcrypto를 CREATE EXTENSION 했었는데, Railway Postgres에서 권한 문제로 실패해서 제거함 —
-- 애초에 불필요한 의존성이었다.)

-- 로컬은 이 스키마를 수동으로 미리 만들어뒀지만, 배포 환경(Railway 등)의 새 Postgres에는 없으므로
-- 여기서 직접 만들어 어떤 환경에서도 스크립트 하나로 초기화되게 한다.
CREATE SCHEMA IF NOT EXISTS petitel;

CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    name VARCHAR(50) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'OPERATOR' CHECK (role IN ('SUPER', 'OPERATOR')),
    created_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_admin_admin_id ON admin_users (admin_id);

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    password VARCHAR(100),
    provider VARCHAR(20) NOT NULL DEFAULT 'LOCAL' CHECK (provider IN ('LOCAL', 'KAKAO')),
    provider_id VARCHAR(100),
    name VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    phone_verified BOOLEAN NOT NULL DEFAULT false,
    terms_agreed BOOLEAN NOT NULL DEFAULT false,
    privacy_agreed BOOLEAN NOT NULL DEFAULT false,
    marketing_agreed BOOLEAN NOT NULL DEFAULT false,
    agreed_at TIMESTAMP NOT NULL DEFAULT now(),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'WITHDRAWN', 'SUSPENDED')),
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_users_email ON users (email);
CREATE UNIQUE INDEX IF NOT EXISTS uq_users_phone ON users (phone);
CREATE UNIQUE INDEX IF NOT EXISTS uq_users_provider ON users (provider, provider_id);

CREATE TABLE IF NOT EXISTS partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_email VARCHAR(255) NOT NULL,
    password VARCHAR(100) NOT NULL,
    business_name VARCHAR(100) NOT NULL,
    business_reg_no VARCHAR(12) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    approved_by UUID REFERENCES admin_users (id),
    approved_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_partners_email ON partners (business_email);
CREATE UNIQUE INDEX IF NOT EXISTS uq_partners_reg_no ON partners (business_reg_no);

CREATE TABLE IF NOT EXISTS pets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users (id),
    name VARCHAR(30) NOT NULL,
    species VARCHAR(10) NOT NULL CHECK (species IN ('DOG', 'CAT', 'ETC')),
    breed VARCHAR(50),
    weight DECIMAL(4, 1),
    age SMALLINT CHECK (age BETWEEN 0 AND 30),
    neutered BOOLEAN NOT NULL DEFAULT false,
    notes VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pets_user_id ON pets (user_id);

CREATE TABLE IF NOT EXISTS hotels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID NOT NULL REFERENCES partners (id),
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    lat DECIMAL(9, 6),
    lng DECIMAL(9, 6),
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_hotels_partner_id ON hotels (partner_id);
CREATE INDEX IF NOT EXISTS idx_hotels_location ON hotels (lat, lng);

CREATE TABLE IF NOT EXISTS hotel_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id UUID NOT NULL REFERENCES hotels (id),
    image_url VARCHAR(500) NOT NULL,
    sort_order SMALLINT NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_hotel_images_hotel_id ON hotel_images (hotel_id);

CREATE TABLE IF NOT EXISTS facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    icon VARCHAR(50)
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_facilities_name ON facilities (name);

CREATE TABLE IF NOT EXISTS hotel_facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id UUID NOT NULL REFERENCES hotels (id),
    facility_id UUID NOT NULL REFERENCES facilities (id)
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_hotel_facility ON hotel_facilities (hotel_id, facility_id);
CREATE INDEX IF NOT EXISTS idx_hf_facility_id ON hotel_facilities (facility_id);

CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id UUID NOT NULL REFERENCES hotels (id),
    name VARCHAR(50) NOT NULL,
    price_per_night INT NOT NULL CHECK (price_per_night > 0),
    extra_pet_fee INT NOT NULL DEFAULT 0,
    max_pets SMALLINT NOT NULL DEFAULT 1 CHECK (max_pets > 0),
    status VARCHAR(20) NOT NULL DEFAULT 'SALE' CHECK (status IN ('SALE', 'STOP')),
    created_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_rooms_hotel_id ON rooms (hotel_id);

CREATE TABLE IF NOT EXISTS room_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES rooms (id),
    image_url VARCHAR(500) NOT NULL,
    sort_order SMALLINT NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_room_images_room_id ON room_images (room_id);

CREATE TABLE IF NOT EXISTS reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users (id),
    hotel_id UUID NOT NULL REFERENCES hotels (id),
    room_id UUID NOT NULL REFERENCES rooms (id),
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED', 'COMPLETED')),
    request_note VARCHAR(500),
    total_price INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now(),
    CHECK (check_out > check_in)
);
CREATE INDEX IF NOT EXISTS idx_res_user_id ON reservations (user_id);
CREATE INDEX IF NOT EXISTS idx_res_hotel_status ON reservations (hotel_id, status);
CREATE INDEX IF NOT EXISTS idx_res_room_dates ON reservations (room_id, check_in, check_out);

CREATE TABLE IF NOT EXISTS reservation_pets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id UUID NOT NULL REFERENCES reservations (id),
    pet_id UUID NOT NULL REFERENCES pets (id)
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_res_pet ON reservation_pets (reservation_id, pet_id);
CREATE INDEX IF NOT EXISTS idx_rp_pet_id ON reservation_pets (pet_id);

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id UUID NOT NULL REFERENCES reservations (id),
    method VARCHAR(20) NOT NULL CHECK (method IN ('CARD', 'KAKAOPAY', 'BANK_TRANSFER')),
    amount INT NOT NULL,
    pg_transaction_id VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID', 'FAILED', 'CANCELLED')),
    paid_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_payments_reservation_id ON payments (reservation_id);
CREATE INDEX IF NOT EXISTS idx_payments_pg_txn ON payments (pg_transaction_id);

CREATE TABLE IF NOT EXISTS refunds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id UUID NOT NULL REFERENCES reservations (id),
    payment_id UUID NOT NULL REFERENCES payments (id),
    reason VARCHAR(200) NOT NULL,
    fee_rate DECIMAL(4, 2) NOT NULL CHECK (fee_rate BETWEEN 0 AND 1),
    refund_amount INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'REQUESTED' CHECK (status IN ('REQUESTED', 'COMPLETED')),
    requested_at TIMESTAMP NOT NULL DEFAULT now(),
    completed_at TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_refunds_reservation_id ON refunds (reservation_id);

CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id UUID NOT NULL REFERENCES reservations (id),
    user_id UUID NOT NULL REFERENCES users (id),
    hotel_id UUID NOT NULL REFERENCES hotels (id),
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    cleanliness_rating SMALLINT CHECK (cleanliness_rating BETWEEN 1 AND 5),
    kindness_rating SMALLINT CHECK (kindness_rating BETWEEN 1 AND 5),
    content VARCHAR(1000) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_reviews_reservation_id ON reviews (reservation_id);
CREATE INDEX IF NOT EXISTS idx_reviews_hotel_id ON reviews (hotel_id);

CREATE TABLE IF NOT EXISTS review_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID NOT NULL REFERENCES reviews (id),
    partner_id UUID NOT NULL REFERENCES partners (id),
    content VARCHAR(500) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_replies_review_id ON review_replies (review_id);

CREATE TABLE IF NOT EXISTS wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users (id),
    hotel_id UUID NOT NULL REFERENCES hotels (id),
    created_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_wishlist_user_hotel ON wishlists (user_id, hotel_id);

CREATE TABLE IF NOT EXISTS settlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id UUID NOT NULL REFERENCES hotels (id),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    gross_amount INT NOT NULL,
    fee_amount INT NOT NULL,
    settlement_amount INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'COMPLETED', 'HOLD')),
    approved_by UUID REFERENCES admin_users (id),
    completed_at TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_settlements_hotel_period ON settlements (hotel_id, period_start);

CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('REVIEW', 'USER')),
    target_id UUID NOT NULL,
    reporter_id UUID REFERENCES users (id),
    reason VARCHAR(200) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'RESOLVED')),
    handled_by UUID REFERENCES admin_users (id),
    handled_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_reports_target ON reports (target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports (status);

CREATE TABLE IF NOT EXISTS policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(50) NOT NULL,
    value VARCHAR(500) NOT NULL,
    updated_by UUID NOT NULL REFERENCES admin_users (id),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_policies_key ON policies (key);

CREATE TABLE IF NOT EXISTS notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    admin_id UUID NOT NULL REFERENCES admin_users (id),
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_notices_created_at ON notices (created_at DESC);
