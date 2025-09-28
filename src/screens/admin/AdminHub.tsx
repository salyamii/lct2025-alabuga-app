import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { AdminDashboard } from "./AdminDashboard";
import { AdminUsers } from "./AdminUsers";
import { AdminMission } from "./AdminMission";
import { AdminSeason } from "./AdminSeason";
import { AdminSettings } from "./AdminSettings";
import { ArrowLeft, Shield } from "lucide-react";

interface AdminScreenProps {
  onBack: () => void;
  onUserDetailOpen: (userId: string) => void;
}

export function AdminScreen({ onBack, onUserDetailOpen }: AdminScreenProps) {
  const [missionCreationOpen, setMissionCreationOpen] = useState(false);
  const [badgeCreationOpen, setBadgeCreationOpen] = useState(false);
  const [rewardCreationOpen, setRewardCreationOpen] = useState(false);
  const [storeManagementOpen, setStoreManagementOpen] = useState(false);
  const [branchCreationOpen, setBranchCreationOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<any>(null);
  const [chainCreationOpen, setChainCreationOpen] = useState(false);
  const [selectedChain, setSelectedChain] = useState<any>(null);
  const [seasonCreationOpen, setSeasonCreationOpen] = useState(false);

  const handleCreateMission = () => {
    setMissionCreationOpen(true);
  };

  const handleCreateReward = () => {
    setRewardCreationOpen(true);
  };

  const handleCreateBadge = () => {
    setBadgeCreationOpen(true);
  };

  const handleManageStore = () => {
    setStoreManagementOpen(true);
  };

  const handleCreateBranch = () => {
    setBranchCreationOpen(true);
  };

  const handleCreateChain = () => {
    setChainCreationOpen(true);
  };

  const handleCreateSeason = () => {
    setSeasonCreationOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-info rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-semibold">
                  Панель администратора
                </h1>
                <p className="text-sm text-muted-foreground">
                  Управление миссиями, пользователями и настройками платформы
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 max-w-2xl">
            <TabsTrigger value="dashboard">Панель управления</TabsTrigger>
            <TabsTrigger value="missions">Миссии</TabsTrigger>
            <TabsTrigger value="seasons">Сезоны</TabsTrigger>
            <TabsTrigger value="users">Пользователи</TabsTrigger>
            <TabsTrigger value="settings">Настройки</TabsTrigger>
          </TabsList>

          <AdminDashboard />

          <AdminMission handleCreateMission={handleCreateMission} />

          <AdminSeason
            handleCreateSeason={handleCreateSeason}
            handleCreateBranch={handleCreateBranch}
            handleCreateChain={handleCreateChain}
            setSelectedBranch={setSelectedBranch}
            setSelectedChain={setSelectedChain}
            setBranchCreationOpen={setBranchCreationOpen}
            setChainCreationOpen={setChainCreationOpen}
          />

          <AdminUsers onUserDetailOpen={onUserDetailOpen} />

          <AdminSettings handleCreateReward={handleCreateReward} handleCreateBadge={handleCreateBadge} handleManageStore={handleManageStore} />
        </Tabs>
      </div>

      {/* Drawers */}
      <MissionCreationDrawer
        open={missionCreationOpen}
        onOpenChange={setMissionCreationOpen}
      />

      <BadgeCreationDrawer
        open={badgeCreationOpen}
        onOpenChange={setBadgeCreationOpen}
      />

      <RewardCreationDrawer
        open={rewardCreationOpen}
        onOpenChange={setRewardCreationOpen}
      />

      <StoreManagementDrawer
        open={storeManagementOpen}
        onOpenChange={setStoreManagementOpen}
      />

      <BranchCreationDrawer
        open={branchCreationOpen}
        onOpenChange={(open) => {
          setBranchCreationOpen(open);
          if (!open) {
            setSelectedBranch(null);
          }
        }}
        editBranch={selectedBranch}
      />

      <MissionChainCreationDrawer
        open={chainCreationOpen}
        onOpenChange={(open) => {
          setChainCreationOpen(open);
          if (!open) {
            setSelectedChain(null);
          }
        }}
        editChain={selectedChain}
      />
    </div>
  );
}

// Заглушки для компонентов Drawer
const MissionCreationDrawer = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => null;
const BadgeCreationDrawer = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => null;
const RewardCreationDrawer = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => null;
const StoreManagementDrawer = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => null;
const BranchCreationDrawer = ({
  open,
  onOpenChange,
  editBranch,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editBranch?: any;
}) => null;
const MissionChainCreationDrawer = ({
  open,
  onOpenChange,
  editChain,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editChain?: any;
}) => null;
