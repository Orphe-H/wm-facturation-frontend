export default function Dashboard() {
	return (
		<div>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
				<div className="rounded-lg bg-white shadow hover:shadow-lg hover:-mx-0.5 px-6 py-3 border">
					<div className="text-sm">Total des ventes</div>
					<div className="space-x-1">
						<span className="text-3xl font-medium">25000</span>
						<span className="">FCFA</span>
					</div>
				</div>
				<div className="rounded-lg bg-green-50 text-green-700 shadow hover:shadow-lg hover:-mx-0.5 px-6 py-3 border">
					<div className="text-sm">Total des ventes payés</div>
					<div className="space-x-1">
						<span className="text-3xl font-medium">10000</span>
						<span className="">FCFA</span>
					</div>
				</div>
				<div className="rounded-lg bg-red-50 text-red-700 shadow hover:shadow-lg hover:-mx-0.5 px-6 py-3 border">
					<div className="text-sm">Total des ventes en attente</div>
					<div className="space-x-1">
						<span className="text-3xl font-medium">15000</span>
						<span className="">FCFA</span>
					</div>
				</div>
			</div>

			<div className="mt-10">
				<h2 className="font-medium text-lg">Dernières factures</h2>
			</div>
		</div>
	);
}
