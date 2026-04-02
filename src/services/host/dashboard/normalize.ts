const unwrapApiData = <T = Record<string, unknown>>(payload: unknown): T | null => {
  if (payload && typeof payload === 'object' && 'data' in (payload as Record<string, unknown>)) {
    return ((payload as Record<string, unknown>).data ?? null) as T | null;
  }

  return (payload ?? null) as T | null;
};

const toArray = <T = Record<string, unknown>>(value: unknown): T[] => {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === 'object') {
    const maybePage = value as Record<string, unknown>;
    if (Array.isArray(maybePage.items)) return maybePage.items as T[];
    if (Array.isArray(maybePage.content)) return maybePage.content as T[];
  }

  return [];
};

const toNumber = (...values: unknown[]) => {
  for (const value of values) {
    if (value === '' || value === null || value === undefined) continue;
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }

  return 0;
};

const pickFirst = <T = unknown>(...values: T[]) => values.find((value) => value !== undefined && value !== null);

const extractMonthLabel = (raw: Record<string, unknown>, index: number) => {
  const month = pickFirst(raw.month, raw.monthLabel, raw.label, raw.name);
  const year = pickFirst(raw.year, raw.labelYear);

  if (typeof month === 'string' && month.trim()) return month;
  if (typeof month === 'number' && typeof year === 'number') return `T${month}/${year}`;
  if (typeof month === 'number') return `T${month}`;

  return `Mục ${index + 1}`;
};

const normalizeCashflowItem = (raw: unknown, index: number) => {
  const data = (raw ?? {}) as Record<string, unknown>;
  const income = toNumber(data.totalIncome, data.income, data.expectedIncome, data.revenue, data.actualIncome);
  const expense = toNumber(data.totalExpense, data.expense, data.cost, data.totalCost);
  const net = toNumber(data.netCashflow, data.net, data.balance, income - expense);

  return {
    label: extractMonthLabel(data, index),
    income,
    expense,
    net,
  };
};

export const normalizeDashboardOverview = (payload: unknown) => {
  const data = (unwrapApiData(payload) ?? {}) as Record<string, unknown>;
  const chartSource =
    pickFirst(
      data.cashflowChart,
      data.chartCashflow6Months,
      data.cashflow6Months,
      data.monthlyCashflow,
      data.chart,
      data.series,
      data.items
    ) ?? [];

  const chart = toArray(chartSource).map(normalizeCashflowItem);
  const occupiedRooms = toNumber(data.occupiedRooms, data.totalOccupiedRooms, data.roomsOccupied);
  const totalRooms = toNumber(data.totalRooms, data.roomsTotal, data.roomCount);
  const availableRooms = toNumber(
    data.availableRooms,
    data.vacantRooms,
    totalRooms > 0 ? totalRooms - occupiedRooms : 0
  );
  const occupancyRate = toNumber(
    data.occupancyRate,
    data.occupancy,
    totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0
  );

  return {
    totalIncome: toNumber(data.totalIncome, data.income, data.actualIncome, data.totalRevenue),
    totalExpense: toNumber(data.totalExpense, data.expense, data.totalCost),
    netCashflow: toNumber(data.netCashflow, data.net, data.balance),
    occupancyRate,
    occupiedRooms,
    totalRooms,
    availableRooms,
    chart,
    raw: data,
  };
};

const inferNotificationType = (value: string) => {
  const normalized = value.toLowerCase();
  if (normalized.includes('invoice') || normalized.includes('debt') || normalized.includes('receipt') || normalized.includes('overdue')) return 'billing';
  if (normalized.includes('contract') || normalized.includes('renew') || normalized.includes('expire')) return 'contract';
  if (normalized.includes('maintenance') || normalized.includes('repair') || normalized.includes('incident')) return 'maintenance';
  return 'general';
};

export const normalizeDashboardNotifications = (payload: unknown) => {
  const data = unwrapApiData(payload);
  const items = toArray(data).map((raw, index) => {
    const item = (raw ?? {}) as Record<string, unknown>;
    const type = inferNotificationType(String(pickFirst(item.type, item.notificationType, item.category, item.kind, 'general')));
    const roomNumber = String(pickFirst(item.roomNumber, item.roomNo, item.roomCode, '') ?? '');
    const propertyName = String(pickFirst(item.propertyName, item.buildingName, item.property, '') ?? '');
    const createdAt = pickFirst(item.createdAt, item.createdDate, item.timestamp, item.date, item.dueDate, item.contractEndDate);
    const title =
      pickFirst(item.title, item.message, item.summary) ??
      (type === 'billing'
        ? 'Cảnh báo công nợ cần xử lý'
        : type === 'contract'
          ? 'Hợp đồng sắp đến hạn'
          : type === 'maintenance'
            ? 'Yêu cầu bảo trì mới'
            : `Thông báo #${index + 1}`);

    return {
      id: pickFirst(item.id, item.notificationId, item.code, `${type}-${index}`),
      type,
      severity: String(pickFirst(item.priority, item.severity, item.level, type === 'billing' ? 'high' : 'medium')),
      title: String(title),
      description: String(pickFirst(item.description, item.detail, item.content, item.note, '') ?? ''),
      roomNumber,
      propertyName,
      createdAt: createdAt ? String(createdAt) : '',
      status: String(pickFirst(item.status, item.state, '') ?? ''),
      raw: item,
    };
  });

  return items;
};
