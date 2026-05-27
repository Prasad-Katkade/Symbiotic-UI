import { useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { X } from "lucide-react-native";
import { useSymbiotic } from "@/symbiotic/SymbioticUI";
import Toast from "react-native-toast-message";
import { useSettings } from "@/contexts/SettingsContext";

type Props = {
  visible: boolean;
  onClose: () => void;
  layoutName: string;
};

export default function EditLayoutModal({
  visible,
  onClose,
  layoutName,
}: Props) {
  const [value, setValue] = useState("");
  const [isMutating, setIsMutating] = useState(false);
  const { getTreeForLLM, addOperations } = useSymbiotic();
  const {setPageEditingEnabled}=useSettings()

  const handleClose = () => {
    setValue("");
    setIsMutating(false);
    setPageEditingEnabled(false);
    onClose();
  };

  const applyOperations = (tree, operations) => {
    const updated = JSON.parse(JSON.stringify(tree));

    operations.forEach((op) => {
      switch (op.type) {
        case "REORDER":
          updated.nodes[op.parent].children = op.order;

          break;

        case "STYLE":
          updated.nodes[op.target].props.designTokens = {
            ...updated.nodes[op.target].props.designTokens,

            ...op.designTokens,
          };

          break;

        case "HIDE": {
          const node = updated.nodes[op.target];

          if (!node) return;

          node.props.hidden = true;
          

          break;
        }

        case "SHOW": {
          const node = updated.nodes[op.target];

          if (!node) return;

          node.props.hidden = false;

          break;
        }

        case "PATCH_TEXT": {
          const node = updated.nodes[op.target];

          if (!node) return;

          node.props.children = op.text;

          break;
        }

        default:
          console.warn("[Symbiotic] Unknown operation:", op.type);
      }
    });

    return updated;
  };

  const applyLLMMutation = async () => {
    // 1. Fetch the exact visual layout the user is currently looking at
    const currentTree = getTreeForLLM(layoutName);

    if (!currentTree || !value.trim()) return;

    try {
      setIsMutating(true);

      const response = await fetch(
        "http://192.168.86.248:3000/partial_mutate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: value, tree: currentTree }),
        },
      );

      if (!response.ok) throw new Error(`API Error`);

      const result = await response.json();

      console.log("Operation", JSON.stringify(result));

      const newOps = result.operations || [];

      
      if (newOps.length <= 0) {
        setIsMutating(false);
        return;
      }

      // 2. Save the operations.
      // The wrapper component will instantly detect this and re-render the activeTree!
      addOperations(layoutName, newOps);

      console.log(
        `[Symbiotic] Applied ${newOps.length} operations successfully.`,
      );
      handleClose();
    } catch (error) {
      console.error("[Symbiotic] Failed:", error);
    } 
  };

  // const applyLLMMutationOld = async () => {
  //   const liveRegistry = getRegistry();

  //   const currentTree = liveRegistry[layoutName];

  //   if (!currentTree || !value.trim()) return;

  //   try {
  //     setIsMutating(true);

  //     const response = await fetch(
  //       "http://192.168.86.248:3000/partial_mutate",
  //       {
  //         method: "POST",

  //         headers: {
  //           "Content-Type": "application/json",
  //         },

  //         body: JSON.stringify({
  //           prompt: value,
  //           tree: currentTree,
  //         }),
  //       },
  //     );

  //     if (!response.ok) {
  //       throw new Error(`API Error:`);
  //     }

  //     const result = await response.json();

  //     console.log("operations == ", JSON.stringify(result, null, 2));

  //     const mutatedTree = applyOperations(currentTree, result.operations || []);

  //     console.log("Updated Layout == \n", JSON.stringify(mutatedTree));

  //     updateRegistry(layoutName, mutatedTree);

  //     console.log("[Symbiotic] Applied operations");
  //   } catch (error) {
  //     console.error("[Symbiotic] Failed:", error);
  //   } finally {
  //     handleClose();
  //   }
  // };

  // const applyLLMMutationFull = async () => {
  //   const liveRegistry = getRegistry();
  //   const currentTree = liveRegistry[layoutName];

  //   if (!currentTree || !value.trim()) return;

  //   try {
  //     // 1. Trigger loading state
  //     setIsMutating(true);

  //     const response = await fetch("http://192.168.86.248:3000/mutate", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         prompt: value,
  //         tree: currentTree,
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error(`API returned status: ${response.status}`);
  //     }

  //     const mutatedTree = await response.json();

  //     if (mutatedTree && mutatedTree.root && mutatedTree.nodes) {
  //       updateRegistry(layoutName, mutatedTree);
  //       console.log(
  //         `[Symbiotic] Mutation successfully applied to ${layoutName}!`,
  //       );
  //     } else {
  //       console.error(
  //         "[Symbiotic] Invalid tree structure returned from API:",
  //         mutatedTree,
  //       );
  //     }
  //   } catch (error) {
  //     console.error("[Symbiotic] Failed to fetch mutation:", error);
  //   } finally {
  //     // 2. Clean up and close modal
  //     handleClose();
  //   }
  // };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={isMutating ? undefined : handleClose}
    >
      <View className="flex-1 bg-black/70 items-center justify-center px-5">
        <View className="w-full bg-zinc-900 rounded-3xl border border-zinc-800 p-5">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <Text className="text-white text-2xl font-bold">
              {isMutating ? "Editing" : "Edit"} {layoutName}
            </Text>
            {/* Hide the close button while mutating to prevent interrupting the flow */}
            {!isMutating && (
              <Pressable onPress={handleClose}>
                <X color="white" size={24} />
              </Pressable>
            )}
          </View>

          {/* Conditional UI: Loading vs Input */}
          {isMutating ? (
            <View className="items-center justify-center py-12">
              <ActivityIndicator size="large" color="#f87171" />
              <Text className="text-zinc-400 mt-5 font-medium text-base">
                Updating the UI...
              </Text>
            </View>
          ) : (
            <>
              <Text className="text-zinc-400 mt-4 leading-6">
                Describe how you want to change this layout. You can move
                elements, change colors, or adjust spacing.
              </Text>

              <TextInput
                value={value}
                onChangeText={setValue}
                placeholder="e.g., Make the profile button blue and move it to the left..."
                placeholderTextColor="#71717a"
                multiline
                className="mt-5 min-h-[120px] rounded-2xl bg-black border border-zinc-800 px-4 py-4 text-white text-base"
              />

              <Pressable
                disabled={!value.trim()}
                onPress={applyLLMMutation}
                className={`mt-5 h-14 rounded-2xl items-center justify-center ${
                  value.trim() ? "bg-red-400" : "bg-red-400/50"
                }`}
              >
                <Text className="text-white text-lg font-semibold">Submit</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}
