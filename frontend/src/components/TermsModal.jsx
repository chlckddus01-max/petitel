import { useEffect } from "react";

const TERMS_CONTENT = {
    terms: {
        title: "서비스 이용약관",
        sections: [
            {
                heading: "제1조 (목적)",
                body: `본 약관은 Petitel(이하 "회사")이 제공하는 반려동물 케어 서비스(펫호텔, 미용, 케어 예약 등, 이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.`,
            },
            {
                heading: "제2조 (이용자의 자격)",
                body: `① 서비스는 만 14세 이상의 개인 또는 법인이 이용할 수 있습니다.\n② 회원가입 시 정확한 정보를 입력하여야 하며, 허위 정보 입력으로 인한 불이익은 이용자 본인이 부담합니다.`,
            },
            {
                heading: "제3조 (서비스 내용)",
                body: `회사는 다음과 같은 서비스를 제공합니다.\n① 펫호텔: 반려동물의 일시적 위탁 숙박 서비스\n② 미용 서비스: 반려동물 목욕, 털 정리, 발톱 정리 등\n③ 케어 서비스: 반려동물 일일 돌봄 및 산책 서비스\n④ 예약 관리: 위 서비스에 대한 온라인 예약 및 일정 관리`,
            },
            {
                heading: "제4조 (예약 및 취소 정책)",
                body: `① 예약은 서비스 이용일 기준 최소 24시간 전까지 가능합니다.\n② 취소 환불 규정은 다음과 같습니다.\n  - 이용일 3일 전 취소: 100% 환불\n  - 이용일 2일 전 취소: 50% 환불\n  - 이용일 1일 전 및 당일 취소: 환불 불가\n③ 천재지변 등 불가피한 사유로 인한 취소는 별도 협의합니다.`,
            },
            {
                heading: "제5조 (반려동물 관련 규정)",
                body: `① 이용자는 반려동물의 건강 상태, 예방접종 이력, 특이사항을 사전에 정확히 고지하여야 합니다.\n② 전염성 질환이 있는 반려동물은 서비스 이용이 제한될 수 있습니다.\n③ 공격성이 있는 반려동물의 경우 사전 고지 의무가 있으며, 미고지로 인한 사고에 대한 책임은 이용자에게 있습니다.\n④ 기본 예방접종(광견병, 종합백신 등) 증빙이 필요할 수 있습니다.`,
            },
            {
                heading: "제6조 (회사의 책임 한계)",
                body: `① 회사는 천재지변, 불가항력적 사유로 서비스를 제공하지 못한 경우 책임을 지지 않습니다.\n② 이용자가 고지하지 않은 반려동물의 기저 질환, 특이사항으로 인해 발생한 문제에 대해 회사는 책임을 지지 않습니다.\n③ 서비스 이용 중 발생한 반려동물 간 사고는 이용자 간 협의를 원칙으로 합니다.`,
            },
            {
                heading: "제7조 (금지 행위)",
                body: `이용자는 다음 행위를 하여서는 안 됩니다.\n① 타인의 정보를 도용하여 서비스를 이용하는 행위\n② 서비스를 통해 얻은 정보를 회사의 동의 없이 상업적으로 이용하는 행위\n③ 서비스 운영을 방해하거나 시스템에 악의적인 영향을 주는 행위\n④ 허위 예약을 반복적으로 생성하는 행위`,
            },
            {
                heading: "제8조 (약관의 변경)",
                body: `회사는 약관을 변경할 경우 최소 7일 전 앱 내 공지사항을 통해 고지합니다. 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단하고 탈퇴할 수 있습니다.`,
            },
        ],
    },
    privacy: {
        title: "개인정보 처리방침",
        sections: [
            {
                heading: "제1조 (수집하는 개인정보 항목)",
                body: `회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다.\n\n[필수 항목]\n· 이름, 이메일 주소, 비밀번호, 휴대폰 번호\n\n[선택 항목]\n· 반려동물 정보(이름, 종, 품종, 나이, 몸무게, 특이사항, 사진)\n· 주소 (방문 서비스 이용 시)\n\n[자동 수집 항목]\n· 서비스 이용 기록, 접속 로그, 기기 정보, IP 주소`,
            },
            {
                heading: "제2조 (개인정보의 수집 및 이용 목적)",
                body: `① 회원 관리: 회원 식별, 가입 및 탈퇴 처리, 불량 회원 관리\n② 서비스 제공: 예약 처리, 결제, 서비스 이용 내역 관리\n③ 반려동물 케어: 맞춤형 케어 서비스 제공을 위한 반려동물 정보 활용\n④ 고객 지원: 민원 처리, 공지사항 전달\n⑤ 서비스 개선: 이용 통계 분석 및 서비스 품질 향상`,
            },
            {
                heading: "제3조 (개인정보의 보유 및 이용 기간)",
                body: `① 회원 탈퇴 시 지체 없이 파기합니다. 단, 관련 법령에 따라 일정 기간 보존합니다.\n\n[관련 법령에 따른 보존 기간]\n· 계약 또는 청약 철회 기록: 5년 (전자상거래법)\n· 대금 결제 및 재화 공급 기록: 5년 (전자상거래법)\n· 소비자 불만 및 분쟁 처리 기록: 3년 (전자상거래법)\n· 접속 로그: 3개월 (통신비밀보호법)`,
            },
            {
                heading: "제4조 (개인정보의 제3자 제공)",
                body: `① 회사는 이용자의 개인정보를 원칙적으로 제3자에게 제공하지 않습니다.\n② 다음의 경우에는 예외로 합니다.\n  - 이용자가 사전에 동의한 경우\n  - 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차에 따른 요청이 있는 경우\n③ 결제 처리를 위해 결제 대행사에 최소한의 정보를 제공할 수 있습니다.`,
            },
            {
                heading: "제5조 (개인정보의 파기)",
                body: `① 전자적 파일 형태로 저장된 개인정보는 복구 불가능한 방법으로 영구 삭제합니다.\n② 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각하여 파기합니다.`,
            },
            {
                heading: "제6조 (이용자의 권리)",
                body: `이용자는 언제든지 다음의 권리를 행사할 수 있습니다.\n① 개인정보 열람 요청\n② 개인정보 정정·삭제 요청\n③ 개인정보 처리 정지 요청\n④ 개인정보 이동 요청\n\n위 권리 행사는 앱 내 '마이페이지 > 계정 설정' 또는 고객센터(support@petitel.com)를 통해 가능합니다.`,
            },
            {
                heading: "제7조 (개인정보 보호책임자)",
                body: `회사는 개인정보 처리에 관한 업무를 총괄하는 개인정보 보호책임자를 지정하고 있습니다.\n\n· 성명: 개인정보 보호팀\n· 이메일: privacy@petitel.com\n· 전화: 02-0000-0000\n\n개인정보 침해 신고는 개인정보 분쟁조정위원회(www.kopico.go.kr) 또는 개인정보 침해신고센터(privacy.kisa.or.kr)에 문의하실 수 있습니다.`,
            },
            {
                heading: "제8조 (쿠키 사용)",
                body: `① 회사는 서비스 이용 편의를 위해 쿠키를 사용할 수 있습니다.\n② 이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있습니다. 단, 쿠키 저장을 거부할 경우 일부 서비스 이용이 제한될 수 있습니다.`,
            },
        ],
    },
};

export default function TermsModal({ type, onClose, onAgree }) {
    const content = TERMS_CONTENT[type];

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    function handleBackdrop(e) {
        if (e.target === e.currentTarget) onClose();
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            onClick={handleBackdrop}
        >
            <div className="flex h-[80vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl">
                {/* 헤더 */}
                <div className="flex items-center justify-between border-b border-surface-container px-6 py-4">
                    <h2 className="text-lg font-extrabold text-on-surface">{content.title}</h2>
                    <button
                        className="flex h-8 w-8 items-center justify-center rounded-full text-outline transition-colors hover:bg-surface-container-low hover:text-on-surface"
                        onClick={onClose}
                        type="button"
                    >
                        <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                </div>

                {/* 본문 */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                    <div className="space-y-6 text-[13px] leading-relaxed text-on-surface-variant">
                        {content.sections.map((section, i) => (
                            <div key={i}>
                                <h3 className="mb-2 font-bold text-on-surface">{section.heading}</h3>
                                <p className="whitespace-pre-line">{section.body}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 버튼 */}
                <div className="flex gap-3 border-t border-surface-container px-6 py-4">
                    <button
                        className="flex-1 rounded-xl border border-outline-variant/30 py-3 text-sm font-bold text-on-surface-variant transition-colors hover:bg-surface-container-low"
                        onClick={onClose}
                        type="button"
                    >
                        닫기
                    </button>
                    <button
                        className="flex-1 rounded-xl bg-primary py-3 text-sm font-extrabold text-white transition-opacity hover:opacity-90"
                        onClick={() => { onAgree(); onClose(); }}
                        type="button"
                    >
                        동의합니다
                    </button>
                </div>
            </div>
        </div>
    );
}