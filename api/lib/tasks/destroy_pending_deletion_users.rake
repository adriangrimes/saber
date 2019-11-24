namespace :users do

  desc "Destroys users where pending_deletion_since is more than X days, and send that user a confirmation email."
  task destroy_pending_deletion: :environment do
    # When ran, this script will delete any users from the database that have had
    # pending_deletion_since for more than X days, and send that user a confirmation
    # email.
    log = ActiveSupport::Logger.new('log/destroyed_users.log')
    start_time = Time.now
    log.info "Task destroy_pending_deletion started at #{start_time}"

    users_to_destroy = User.where('pending_deletion_since <= ?',
      Rails.application.config.x.saber.account_destroy_delay)
    if users_to_destroy.exists?
      if destroyed_users = users_to_destroy.destroy_all
        destroyed_users.each do |user|
          log.info "Destroyed user - id: #{user.id}, username: #{user.username}"
          # Send a deletion email after successfully destroying user
          user_to_email = {
            email: user.email,
            username: user.username
          }
          UserMailer
            .with(user: user_to_email)
            .account_deleted_email
            .deliver
        end
      else
        log.info "ERROR: Users failed to destroy"
        users_to_destroy.each do |user|
          log.info " - id: #{user.id}, email: #{user.email}, username: #{user.username}"
        end
      end
    else
      log.info "No users to destroy"
    end
    end_time = Time.now
    duration = (start_time - end_time) / 1.seconds
    log.info "Task destroy_pending_deletion finished at #{end_time} and took #{duration} seconds."
    log.close
  end

end
