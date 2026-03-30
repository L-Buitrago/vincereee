// Platform Mock Data - Dados realistas brasileiros

export interface Client {
  id: string;
  name: string;
  email: string;
  avatar: string;
  product: string;
  purchaseDate: string;
  amount: number;
  status: "ativo" | "pendente" | "vencido" | "cancelado";
  phone: string;
}

export interface Transaction {
  id: string;
  clientName: string;
  product: string;
  amount: number;
  gateway: "Stripe" | "Pagar.me";
  status: "aprovado" | "pendente" | "recusado" | "estornado";
  date: string;
}

export interface Product {
  id: string;
  name: string;
  type: "Curso" | "Serviço" | "Assinatura" | "Produto físico";
  price: number;
  totalSales: number;
  image: string;
}

export interface Checkout {
  id: string;
  name: string;
  product: string;
  conversion: number;
  totalSales: number;
  status: "ativo" | "inativo";
  link: string;
}

export const mockClients: Client[] = [
  { id: "1", name: "Ana Costa", email: "ana@email.com", avatar: "AC", product: "Curso de Marketing", purchaseDate: "2026-03-05", amount: 497, status: "ativo", phone: "5511999001001" },
  { id: "2", name: "Bruno Lima", email: "bruno@email.com", avatar: "BL", product: "Mentoria Mensal", purchaseDate: "2026-03-08", amount: 297, status: "pendente", phone: "5511999002002" },
  { id: "3", name: "Carla Santos", email: "carla@email.com", avatar: "CS", product: "Acesso Anual", purchaseDate: "2026-02-15", amount: 1997, status: "ativo", phone: "5511999003003" },
  { id: "4", name: "Diego Ferreira", email: "diego@email.com", avatar: "DF", product: "Curso Básico", purchaseDate: "2026-01-20", amount: 197, status: "vencido", phone: "5511999004004" },
  { id: "5", name: "Elena Rodrigues", email: "elena@email.com", avatar: "ER", product: "Assinatura Pro", purchaseDate: "2026-03-01", amount: 97, status: "ativo", phone: "5511999005005" },
  { id: "6", name: "Felipe Oliveira", email: "felipe@email.com", avatar: "FO", product: "Curso de Marketing", purchaseDate: "2026-03-09", amount: 497, status: "ativo", phone: "5511999006006" },
  { id: "7", name: "Gabriela Souza", email: "gabriela@email.com", avatar: "GS", product: "Mentoria Mensal", purchaseDate: "2026-03-07", amount: 297, status: "pendente", phone: "5511999007007" },
  { id: "8", name: "Hugo Martins", email: "hugo@email.com", avatar: "HM", product: "Acesso Anual", purchaseDate: "2026-02-28", amount: 1997, status: "ativo", phone: "5511999008008" },
  { id: "9", name: "Isabela Nunes", email: "isabela@email.com", avatar: "IN", product: "Curso Básico", purchaseDate: "2026-02-10", amount: 197, status: "cancelado", phone: "5511999009009" },
  { id: "10", name: "João Pedro Silva", email: "joao@email.com", avatar: "JS", product: "Assinatura Pro", purchaseDate: "2026-03-03", amount: 97, status: "ativo", phone: "5511999010010" },
  { id: "11", name: "Larissa Campos", email: "larissa@email.com", avatar: "LC", product: "Curso de Marketing", purchaseDate: "2026-03-10", amount: 497, status: "ativo", phone: "5511999011011" },
  { id: "12", name: "Marcos Ribeiro", email: "marcos@email.com", avatar: "MR", product: "Mentoria Mensal", purchaseDate: "2026-03-06", amount: 297, status: "pendente", phone: "5511999012012" },
  { id: "13", name: "Natália Alves", email: "natalia@email.com", avatar: "NA", product: "Acesso Anual", purchaseDate: "2026-01-15", amount: 1997, status: "vencido", phone: "5511999013013" },
  { id: "14", name: "Otávio Barros", email: "otavio@email.com", avatar: "OB", product: "Curso Básico", purchaseDate: "2026-03-04", amount: 197, status: "ativo", phone: "5511999014014" },
  { id: "15", name: "Patrícia Mendes", email: "patricia@email.com", avatar: "PM", product: "Assinatura Pro", purchaseDate: "2026-03-02", amount: 97, status: "ativo", phone: "5511999015015" },
];

export const mockTransactions: Transaction[] = [
  { id: "TXN-001", clientName: "Ana Costa", product: "Curso de Marketing", amount: 497, gateway: "Stripe", status: "aprovado", date: "2026-03-05 14:23" },
  { id: "TXN-002", clientName: "Bruno Lima", product: "Mentoria Mensal", amount: 297, gateway: "Pagar.me", status: "pendente", date: "2026-03-08 09:15" },
  { id: "TXN-003", clientName: "Carla Santos", product: "Acesso Anual", amount: 1997, gateway: "Stripe", status: "aprovado", date: "2026-02-15 16:42" },
  { id: "TXN-004", clientName: "Diego Ferreira", product: "Curso Básico", amount: 197, gateway: "Pagar.me", status: "recusado", date: "2026-01-20 11:08" },
  { id: "TXN-005", clientName: "Elena Rodrigues", product: "Assinatura Pro", amount: 97, gateway: "Stripe", status: "aprovado", date: "2026-03-01 08:30" },
  { id: "TXN-006", clientName: "Felipe Oliveira", product: "Curso de Marketing", amount: 497, gateway: "Stripe", status: "aprovado", date: "2026-03-09 10:55" },
  { id: "TXN-007", clientName: "Gabriela Souza", product: "Mentoria Mensal", amount: 297, gateway: "Pagar.me", status: "pendente", date: "2026-03-07 13:20" },
  { id: "TXN-008", clientName: "Hugo Martins", product: "Acesso Anual", amount: 1997, gateway: "Stripe", status: "aprovado", date: "2026-02-28 15:10" },
  { id: "TXN-009", clientName: "Isabela Nunes", product: "Curso Básico", amount: 197, gateway: "Pagar.me", status: "estornado", date: "2026-02-10 09:45" },
  { id: "TXN-010", clientName: "João Pedro Silva", product: "Assinatura Pro", amount: 97, gateway: "Stripe", status: "aprovado", date: "2026-03-03 07:58" },
  { id: "TXN-011", clientName: "Larissa Campos", product: "Curso de Marketing", amount: 497, gateway: "Stripe", status: "aprovado", date: "2026-03-10 12:30" },
  { id: "TXN-012", clientName: "Marcos Ribeiro", product: "Mentoria Mensal", amount: 297, gateway: "Pagar.me", status: "pendente", date: "2026-03-06 14:05" },
];

export const mockProducts: Product[] = [
  { id: "1", name: "Curso de Marketing Digital", type: "Curso", price: 497, totalSales: 234, image: "📚" },
  { id: "2", name: "Mentoria Mensal Premium", type: "Serviço", price: 297, totalSales: 89, image: "🎯" },
  { id: "3", name: "Acesso Anual Completo", type: "Assinatura", price: 1997, totalSales: 45, image: "⭐" },
  { id: "4", name: "Curso Básico de Vendas", type: "Curso", price: 197, totalSales: 312, image: "📖" },
  { id: "5", name: "Assinatura Pro Mensal", type: "Assinatura", price: 97, totalSales: 567, image: "🔑" },
  { id: "6", name: "Kit Empreendedor", type: "Produto físico", price: 147, totalSales: 78, image: "📦" },
];

export const mockCheckouts: Checkout[] = [
  { id: "1", name: "Checkout Marketing", product: "Curso de Marketing Digital", conversion: 12.5, totalSales: 234, status: "ativo", link: "https://pay.vincere.com/mkt" },
  { id: "2", name: "Checkout Mentoria", product: "Mentoria Mensal Premium", conversion: 8.3, totalSales: 89, status: "ativo", link: "https://pay.vincere.com/mentoria" },
  { id: "3", name: "Checkout Anual", product: "Acesso Anual Completo", conversion: 5.7, totalSales: 45, status: "ativo", link: "https://pay.vincere.com/anual" },
  { id: "4", name: "Checkout Básico", product: "Curso Básico de Vendas", conversion: 15.2, totalSales: 312, status: "inativo", link: "https://pay.vincere.com/basico" },
  { id: "5", name: "Checkout Pro", product: "Assinatura Pro Mensal", conversion: 22.1, totalSales: 567, status: "ativo", link: "https://pay.vincere.com/pro" },
];

export const revenueChartData = [
  { date: "01 Mar", value: 2450 },
  { date: "02 Mar", value: 3200 },
  { date: "03 Mar", value: 2800 },
  { date: "04 Mar", value: 4100 },
  { date: "05 Mar", value: 3750 },
  { date: "06 Mar", value: 5200 },
  { date: "07 Mar", value: 4800 },
  { date: "08 Mar", value: 6100 },
  { date: "09 Mar", value: 5500 },
  { date: "10 Mar", value: 7200 },
  { date: "11 Mar", value: 6800 },
];

export const dashboardMetrics = {
  totalSales: { value: 58, change: 26.1 },
  totalRevenue: { value: 35635.25, change: 206.6 },
  pending: { value: 10, change: -77.8 },
  failed: { value: 0, change: 0 },
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};
