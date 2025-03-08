export const useStringUtils = () => {
  /**
   *  getInitials from a name
   * @param {string} name - The name
   * @returns {string} The initials
   * @example
   * getInitials("John Doe") // JD
   * getInitials("John") // JO
   * getInitials("Johnathan") // JO
   * getInitials("John Jacob Smith") // "JS" (first and last initials)
   */
  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/).filter(Boolean)

    if (parts.length === 0) return "  "

    if (parts.length === 1) {
      // For single names, take first two letters
      const singleName = parts[0].toUpperCase()
      return singleName.length >= 2 ? singleName.slice(0, 2) : singleName.padEnd(2, " ")
    }

    // For multiple names, take first letter of first and last names
    const firstInitial = parts[0].charAt(0)
    const lastInitial = parts[parts.length - 1].charAt(0)

    return (firstInitial + lastInitial).toUpperCase()
  }

  return { getInitials }
}
