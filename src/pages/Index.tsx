import { DashboardHeader } from "@/components/DashboardHeader";
import { TrendingCombos } from "@/components/TrendingCombos";
import { AIComboCreator } from "@/components/AIComboCreator";
import { PromotionOpportunities } from "@/components/PromotionOpportunities";
import { SmartUpsell } from "@/components/SmartUpsell";
import { ItemNetwork } from "@/components/ItemNetwork";
import { TopCombinationsChart } from "@/components/TopCombinationsChart";
import { AssociationRulesTable } from "@/components/AssociationRulesTable";
import { UploadSection } from "@/components/UploadSection";

const Index = () => (
  <div className="min-h-screen">
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
      <DashboardHeader />
      <UploadSection />
      <TrendingCombos />
      <AIComboCreator />
      <PromotionOpportunities />
      <SmartUpsell />
      <ItemNetwork />
      <TopCombinationsChart />
      <AssociationRulesTable />
      <footer className="text-center py-8 text-xs text-muted-foreground">
        <p>🐝 Jollibee Market Basket Intelligence · Powered by AI</p>
      </footer>
    </div>
  </div>
);

export default Index;
