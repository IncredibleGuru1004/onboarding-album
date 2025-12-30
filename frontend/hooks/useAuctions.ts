import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import {
  fetchAuctions,
  loadMoreAuctions,
  fetchRecentAuctions,
  fetchAuctionById,
  createAuction,
  updateAuctionThunk,
  deleteAuctionThunk,
  selectAuctions,
  selectRecentAuctions,
  selectCurrentAuction,
  selectAuctionsLoading,
  selectAuctionsLoadingMore,
  selectAuctionsError,
  selectAuctionsNextCursor,
  selectAuctionsHasMore,
  clearError,
  clearCurrentAuction,
} from "@/store/auctionSlice";
import { CreateAuctionDto, UpdateAuctionDto } from "@/types/auction";

/**
 * Hook for managing auctions
 * Provides access to auction state and actions
 */
export function useAuctions() {
  const dispatch = useDispatch<AppDispatch>();
  const auctions = useSelector(selectAuctions);
  const recentAuctions = useSelector(selectRecentAuctions);
  const currentAuction = useSelector(selectCurrentAuction);
  const isLoading = useSelector(selectAuctionsLoading);
  const isLoadingMore = useSelector(selectAuctionsLoadingMore);
  const error = useSelector(selectAuctionsError);
  const nextCursor = useSelector(selectAuctionsNextCursor);
  const hasMore = useSelector(selectAuctionsHasMore);

  /**
   * Fetch all auctions with optional filters and pagination
   */
  const loadAuctions = async (filters?: {
    categoryID?: string;
    userId?: string;
    limit?: number;
  }) => {
    try {
      await dispatch(fetchAuctions(filters)).unwrap();
      return true;
    } catch (error) {
      console.error("Failed to load auctions:", error);
      return false;
    }
  };

  /**
   * Load more auctions for infinite scrolling
   */
  const loadMore = async (filters?: {
    categoryID?: string;
    userId?: string;
    limit?: number;
  }) => {
    if (!nextCursor || !hasMore || isLoadingMore) {
      return false;
    }

    try {
      await dispatch(
        loadMoreAuctions({ ...filters, cursor: nextCursor }),
      ).unwrap();
      return true;
    } catch (error) {
      console.error("Failed to load more auctions:", error);
      return false;
    }
  };

  /**
   * Fetch recent auctions
   */
  const loadRecentAuctions = async () => {
    try {
      await dispatch(fetchRecentAuctions()).unwrap();
      return true;
    } catch (error) {
      console.error("Failed to load recent auctions:", error);
      return false;
    }
  };

  /**
   * Fetch a single auction by ID
   */
  const loadAuctionById = async (id: number) => {
    try {
      await dispatch(fetchAuctionById(id)).unwrap();
      return true;
    } catch (error) {
      console.error("Failed to load auction:", error);
      return false;
    }
  };

  /**
   * Create a new auction
   */
  const addAuction = async (data: CreateAuctionDto) => {
    try {
      const result = await dispatch(createAuction(data)).unwrap();
      return result;
    } catch (error) {
      console.error("Failed to create auction:", error);
      throw error;
    }
  };

  /**
   * Update an existing auction
   */
  const updateAuction = async (id: number, data: UpdateAuctionDto) => {
    try {
      const result = await dispatch(updateAuctionThunk({ id, data })).unwrap();
      return result;
    } catch (error) {
      console.error("Failed to update auction:", error);
      throw error;
    }
  };

  /**
   * Delete an auction
   */
  const deleteAuction = async (id: number) => {
    try {
      await dispatch(deleteAuctionThunk(id)).unwrap();
      return true;
    } catch (error) {
      console.error("Failed to delete auction:", error);
      throw error;
    }
  };

  /**
   * Clear any error messages
   */
  const clearErrorMessage = () => {
    dispatch(clearError());
  };

  /**
   * Clear the current auction
   */
  const clearCurrent = () => {
    dispatch(clearCurrentAuction());
  };

  /**
   * Get an auction by ID from the current state
   */
  const getAuctionById = (id: number) => {
    return auctions.find((auction) => auction.id === id) || null;
  };

  return {
    // State
    auctions,
    recentAuctions,
    currentAuction,
    isLoading,
    isLoadingMore,
    error,
    nextCursor,
    hasMore,

    // Actions
    loadAuctions,
    loadMore,
    loadRecentAuctions,
    loadAuctionById,
    addAuction,
    updateAuction,
    deleteAuction,
    clearErrorMessage,
    clearCurrent,
    getAuctionById,
  };
}
