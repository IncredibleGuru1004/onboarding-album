import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import {
  fetchAuctions,
  loadMoreAuctions,
  fetchRecentAuctions,
  fetchMyAuctions,
  fetchAuctionById,
  createAuction,
  updateAuctionThunk,
  deleteAuctionThunk,
  selectAuctions,
  selectMyAuctions,
  selectRecentAuctions,
  selectCurrentAuction,
  selectAuctionsLoading,
  selectMyAuctionsLoading,
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
  const myAuctions = useSelector(selectMyAuctions);
  const recentAuctions = useSelector(selectRecentAuctions);
  const currentAuction = useSelector(selectCurrentAuction);
  const isLoading = useSelector(selectAuctionsLoading);
  const isLoadingMyAuctions = useSelector(selectMyAuctionsLoading);
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
   * Fetch all auctions for the authenticated user (no pagination)
   */
  const loadMyAuctions = async () => {
    try {
      await dispatch(fetchMyAuctions()).unwrap();
      return true;
    } catch (error) {
      console.error("Failed to load my auctions:", error);
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
    myAuctions,
    recentAuctions,
    currentAuction,
    isLoading,
    isLoadingMyAuctions,
    isLoadingMore,
    error,
    nextCursor,
    hasMore,

    // Actions
    loadAuctions,
    loadMore,
    loadRecentAuctions,
    loadMyAuctions,
    loadAuctionById,
    addAuction,
    updateAuction,
    deleteAuction,
    clearErrorMessage,
    clearCurrent,
    getAuctionById,
  };
}
